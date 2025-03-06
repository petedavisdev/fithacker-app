import { Text, View } from 'react-native';

import { UserContext } from '../../app/_layout';
import { UserLogin } from './UserLogin';
import { useContext } from 'react';

export function UserAccount() {
	const user = useContext(UserContext);

	if (!user) return <UserLogin />;

	return (
		<View>
			<View>
				<Text className="text-lg text-cyan-400 font-mono">
					{user?.email}
				</Text>
			</View>
		</View>
	);
}
