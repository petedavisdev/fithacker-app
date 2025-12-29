import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, View } from 'react-native';
import { AButton } from '@/shared/components/AButton';
import { USERNAME } from '@/shared/utils/constants';
import { useCreateProfile } from './useCreateProfile';
import { useUpdateProfile } from './useUpdateProfile';
import { useRouter } from 'expo-router';

type UsernameInputProps = {
	mode: 'create' | 'update';
	initialUsername?: string;
	onSuccess?: () => void;
	autoFocus?: boolean;
};

export function UsernameInput(props: UsernameInputProps) {
	const { t } = useTranslation();
	const router = useRouter();
	const inputRef = useRef<TextInput>(null);
	const [username, setUsername] = useState(props.initialUsername ?? '');
	const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
	const { createProfile, isCreatingProfile, errorCreateProfile } =
		useCreateProfile();
	const { updateProfile, isUpdatingProfile, errorUpdateProfile } =
		useUpdateProfile();

	const isSubmitting =
		props.mode === 'create' ? isCreatingProfile : isUpdatingProfile;
	const error =
		props.mode === 'create' ? errorCreateProfile : errorUpdateProfile;

	const isUsernameValid =
		username.length >= USERNAME.MIN_LENGTH &&
		username.length <= USERNAME.MAX_LENGTH &&
		USERNAME.REGEX.test(username);
	const isUsernameInUse =
		error && (error as { code?: string }).code === '23505';

	// Validation error messages (only shown after submit attempt)
	function getValidationError(): string | null {
		if (!hasAttemptedSubmit || isUsernameValid) {
			return null;
		}

		// Check for invalid characters first
		const invalidChars = Array.from(username)
			.filter((char) => !USERNAME.REGEX.test(char))
			.filter((char, index, arr) => arr.indexOf(char) === index) // Unique
			.join(', ');

		if (invalidChars) {
			return t('_@.usernameInvalidCharacters', { chars: invalidChars });
		}

		if (username.length < USERNAME.MIN_LENGTH) {
			return t('_@.usernameTooShort', { min: USERNAME.MIN_LENGTH });
		}

		if (username.length > USERNAME.MAX_LENGTH) {
			return t('_@.usernameTooLong', { max: USERNAME.MAX_LENGTH });
		}

		return null;
	}

	const validationError = getValidationError();
	const showValidationError = hasAttemptedSubmit && validationError !== null;

	// Clear validation error immediately when username becomes valid
	useEffect(() => {
		if (hasAttemptedSubmit && isUsernameValid) {
			setHasAttemptedSubmit(false);
		}
	}, [hasAttemptedSubmit, isUsernameValid, username]);

	// Auto-focus input when autoFocus prop is true
	useEffect(() => {
		if (props.autoFocus && inputRef.current) {
			// Small delay to ensure the component is fully mounted
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	}, [props.autoFocus]);

	function handleSubmit() {
		if (isSubmitting) return;

		setHasAttemptedSubmit(true);

		if (isUsernameValid) {
			// For update mode, skip if username hasn't changed
			if (props.mode === 'update' && username === props.initialUsername) {
				// Username hasn't changed, just call onSuccess to close the editor
				if (props.onSuccess) {
					props.onSuccess();
				}
				return;
			}

			if (props.mode === 'create') {
				createProfile(
					{ username },
					{
						onSuccess: () => {
							if (props.onSuccess) {
								props.onSuccess();
							} else {
								router.replace('/account');
							}
						},
					},
				);
			} else {
				updateProfile(
					{ username },
					{
						onSuccess: () => {
							if (props.onSuccess) {
								props.onSuccess();
							}
						},
						onError: (error) => {
							// Error is already handled by the error state
							console.error('Failed to update username:', error);
						},
					},
				);
			}
		}
	}

	return (
		<View>
			<View className="flex-row items-center gap-2">
				<TextInput
					ref={inputRef}
					className="text-yellow-400 font-mono border-y-2 border-b-yellow-500 border-t-transparent pt-4 pb-4 focus:text-pink-400 focus:border-b-pink-500 outline-none flex-1"
					value={username}
					onChangeText={(text) => {
						setUsername(text);
					}}
					autoCapitalize="none"
					autoCorrect={false}
					maxLength={USERNAME.MAX_LENGTH}
					placeholder={props.mode === 'create' ? t('_@.usernameLabel') : ''}
					placeholderTextColor="#f472b6"
					editable={!isSubmitting}
				/>
				<AButton onPress={handleSubmit} isDisabled={isSubmitting} size="sm">
					{isSubmitting ? '⏳' : '👉'}
				</AButton>
			</View>
			{(showValidationError ||
				isUsernameInUse ||
				(error && !isUsernameInUse && !showValidationError)) && (
				<View className="mt-2">
					{showValidationError && (
						<Text className="font-mono text-pink-400">{validationError}</Text>
					)}
					{isUsernameInUse && (
						<Text className="font-mono text-pink-400">
							{t('_@.usernameInUse')}
						</Text>
					)}
					{error && !isUsernameInUse && !showValidationError && (
						<Text className="font-mono text-pink-400">{error.message}</Text>
					)}
				</View>
			)}
		</View>
	);
}
