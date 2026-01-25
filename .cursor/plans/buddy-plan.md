This plan outlines a Local-First, Cloud-Synced architecture. It treats the local device as the "source of truth" for the UI, while using Supabase as a background relay for sharing and a persistent mirror for multi-device sync.



Phase 1: The Database & Privacy Layer (Supabase)

We need to store data such that individual "Notes" are never exposed to buddies, and the "Buddy List" is backed up only for logged-in users.

1.1 The Sanitized View

This SQL ensures that when a buddy fetches your data via a share_token, they only receive the exercise types, never your private text notes.

SQL



-- Flatten JSONB array [["arms", "heavy weights”], "legs"] into ["arms", "legs"]

CREATE OR REPLACE FUNCTION public.sanitize_exercises(input_json jsonb)

RETURNS jsonb AS $$

BEGIN

    RETURN (

        SELECT jsonb_agg(CASE WHEN jsonb_typeof(e) = 'array' THEN e->0 ELSE e END)

        FROM jsonb_array_elements(input_json) AS e

    );

END;

$$ LANGUAGE plpgsql IMMUTABLE;



-- Public view: Accessible via share_token

CREATE OR REPLACE VIEW public.shared_buddy_data AS

SELECT 

    p.share_token, 

    ud.day, 

    public.sanitize_exercises(ud.exercise_data) AS exercises

FROM public.user_days ud

JOIN public.profiles p ON p.id = ud.user_id;

1.2 The Buddy Mirror Table

This stores the "Address Book." If a user is local-only, this lives in AsyncStorage. If logged in, it syncs here.

SQL



CREATE TABLE public.followed_buddies (

  user_id uuid REFERENCES auth.users NOT NULL,

  buddy_token uuid NOT NULL,

  nickname text,

  is_pinned boolean DEFAULT false,

  view_count int DEFAULT 0,

  last_viewed_at timestamptz DEFAULT now(),

  PRIMARY KEY (user_id, buddy_token)

);



Phase 2: Local Persistence & Hydration (React Query)

To make the app work offline and across restarts, we persist the React Query cache to the device's storage.

2.1 The Persister Setup

This logic "hydrates" the app on startup with whatever data was there when it last closed.

JavaScript



import AsyncStorage from '@react-native-async-storage/async-storage';

import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';



const persister = createAsyncStoragePersister({

  storage: AsyncStorage,

  key: 'OFFLINE_CACHE',

});



// Provides 24hr staleTime so buddies are visible offline immediately

const queryClient = new QueryClient({

  defaultOptions: {

    queries: {

      staleTime: 1000 * 60 * 60 * 24, // 24 hours

      gcTime: 1000 * 60 * 60 * 24 * 7, // Keep for 7 days

    },

  },

});



Phase 3: The Multi-Device Sync Strategy

The app should follow a "Local-Write, Background-Sync" pattern.

Adding a Buddy:
Add to local state/AsyncStorage immediately.
If supabase.auth.user() exists, fire a useMutation to upsert into followed_buddies.
Fetching Buddy Data:
Use the buddy_token as the queryKey.
React Query returns the cached (offline) data first.
In the background, it fetches from the shared_buddy_data view to get updates.
2.2 Key React Query Hook

JavaScript



export const useBuddyData = (token) => {

  return useQuery({

    queryKey: ['buddy', token],

    queryFn: async () => {

      const { data } = await supabase

        .from('shared_buddy_data')

        .select('*')

        .eq('share_token', token);

      return data;

    },

    // App remains functional even if this fetch fails

    retry: 2,

  });

};



Phase 4: Competitive & Privacy "Wins"

Age Rating (4+): By using a database View to strip notes, we mathematically guarantee that no "User Generated Content" (chat/text) can be shared. No moderation system is required because no communication is possible beyond "I did my reps."
Privacy: Share tokens are UUIDs. There is no "Search for users" feature. Connections are 100% private and intentional.
Collaborative Logic: The app sums LocalCount + CachedBuddyCount. The awards (🚀 3x / 🌟 4x) are calculated on the client, meaning the "Team Progress" is always available even without a connection.
Multi-Device Sync: Because the followed_buddies table (nicknames, pins, and tokens) is mirrored in Supabase, logging in on a second device automatically populates the dropdown with the same buddies.


We will need simple sync and "Conflict Resolution" logic for when a user pins a buddy on their iPhone while offline, and how that merges with the Supabase backup once they reconnect.





Here is the ux journey:



This addition is vital for the 4+ age rating and user privacy. By forcing a "Naming Step" before the data is revealed, you ensure the user acknowledges the connection and keeps their "Address Book" organized with names they recognize, rather than a list of random UUIDs.



Phase 1: Andy (The Power User)

Goal: Backup first, Share second.

Private Backup: Andy has been logging exercises locally. He creates an account so his data is available on both his iPhone and iPad. He is backed up, but his share_token remains NULL.
The Sharing Decision: Andy goes to "Sharing Settings" and toggles Enable Sharing.
The Link: Only now is his share_token minted. He sends the link to Betty: ourapp.com/share/andy-token.


Phase 2: Betty (The Web-First Buddy)

Goal: The "Identity Handshake" on the web.

The Landing Page: Betty clicks the link. The browser opens the web app.
The Identity Gate: Before showing Andy's chart, Betty sees a friendly screen:
"You found a buddy!" > "Someone shared their exercise chart with you. Who is this?"
Input Field: Betty types "Andy" (or "Bestie").
Action: She taps "View Chart."
The Local Association: The web app saves the token and the nickname "Andy" to her Browser's LocalStorage.
The Reveal: Only after she provides a name does the chart load, showing Andy’s sanitized exercise variety for the week.


Phase 3: Betty Reciprocates (The Cloud Sync)

Goal: Moving from local web storage to a persistent cloud account.

Log & Join: Betty logs her own workout in the browser. Later, she decides to "Create Account."
Seamless Migration: Her local "Address Book" (containing the name "Andy") and her own logs are pushed to her new Supabase profile.
The Return Invite: Betty enables sharing and sends her link back to Andy.


Phase 4: Andy (The App Handshake)

Goal: Deep linking and naming Betty.

Deep Link Activation: Andy taps Betty's link. His iPhone opens the link directly inside the native app.
The Naming Step: Even though Betty's name might be in the link metadata, Andy gets the same prompt:
"You found a buddy!" > "Who is this?"
The Connection: Andy types "Betty." The app saves the association and syncs buddy in the background
The Result: The columned list of links in the account page now shows:
Me 12 🏅🏆
Betty 14 🏅🏆   |    + me 26 🚀🌟  | 🤍 ❌


Links lead to individual charts and “+ me” links lead to combined charts
Faded white heart means not favourite. 💛 means fav. Favs shown below me, but above other buddies. Secondary sort by most viewed, which increments when viewing Betty’s chart and/or their combined chart, debounced slowly to avoid counting fidgeting with the app. Thirdly sort by nickname to keep things relatively stable.
❌ leads to modal to confirm before deleting


Developer Logic: The "Naming Step" Flow

To implement this safely, your SharePage component should follow this logic:

JavaScript



const SharePage = ({ token }) => {

  const [nickname, setNickname] = useState('');



  // 1. Check if we already have this token named locally

  const {isBuddy,  saveBuddy, isSavingBuddy } = useBuddy(token);



  if (!existingBuddy) {

    return (

      <View>

        <Text>You found a fithacker! Who is this?</Text>

        <TextInput 

          placeholder="Enter their name, initials, or a nickname" 

          onChangeText={setNickname} 

        />

        <Text>Only you will see this name.</Text>

        <Button 

          title="👍" 

          onPress={() => saveBuddy(token, nickname)} 

          disabled={isSavingBuddy}

        />

      </View>

    );

  }



  // 2. Only show the chart if the buddy is "Known" (Named)

  return <Chart token={token} />;

}



Why this is a "Privacy Win"

Local Nicknames: Andy might call Betty "Babs," and Betty might call Andy "The Boss." Because these names are stored locally first (and then synced as a private mirror), the users are never forced to use a public "Handle" or "Username."
Human Confirmation: The naming step prevents "ghost connections" where a user accidentally clicks a link and starts tracking a stranger without realizing it. It ensures every connection in the 2-column dropdown is intentional and recognized.
