import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';
import { AModal } from '@/shared/components/AModal';
import { AText } from '@/shared/components/AText';
import { useDeleteAccount } from './useDeleteAccount';

type DeleteAccountModalProps = {
	isOpen: boolean;
	onClose: () => void;
};

export function DeleteAccountModal(props: DeleteAccountModalProps) {
	const { t } = useTranslation();
	const { deleteAccount, isDeletingAccount } = useDeleteAccount();
	const [confirmed, setConfirmed] = useState(false);

	function handleClose() {
		setConfirmed(false);
		props.onClose();
	}

	function handleDelete() {
		if (confirmed && !isDeletingAccount) {
			deleteAccount(undefined, {
				onSuccess: () => {
					handleClose();
				},
			});
		}
	}

	return (
		<AModal isOpen={props.isOpen} onClose={handleClose}>
			<View className="p-6 gap-6">
				<AText color="pink" size="2xl" className="font-bold text-center">
					⚠️ {t('_account.deleteAccountTitle')}
				</AText>

				<AText size="base" className="text-center leading-6">
					{t('_account.deleteAccountWarning')}
				</AText>

				<AText color="yellow" size="base" className="text-center leading-6">
					{t('_account.deleteAccountLocalData')}
				</AText>

				<Pressable
					onPress={() => {
						setConfirmed(!confirmed);
					}}
					disabled={isDeletingAccount}
				>
					<View className="flex-row items-center justify-center gap-3">
						<View
							className={`w-6 h-6 border-2 rounded items-center justify-center ${
								confirmed ? 'border-pink-400 bg-pink-400' : 'border-slate-400'
							}`}
						>
							{confirmed && (
								<AText size="lg" className="text-bg leading-none">
									✓
								</AText>
							)}
						</View>
						<AText size="sm">{t('_account.deleteAccountConfirm')}</AText>
					</View>
				</Pressable>

				<View className="gap-3 items-center">
					<Pressable
						onPress={handleDelete}
						disabled={!confirmed || isDeletingAccount}
					>
						<View
							className={`px-6 py-3 items-center justify-center border-2 border-pink-500 rounded-full ${
								!confirmed || isDeletingAccount ? 'opacity-35' : ''
							}`}
							style={{
								shadowColor: '#be185d',
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.25,
								shadowRadius: 3.84,
								elevation: 5,
							}}
						>
							<AText color="pink" size="base" className="text-center">
								{isDeletingAccount ? '⏳' : '🗑️'}{' '}
								{t('_account.deleteAccountButton')}
							</AText>
						</View>
					</Pressable>

					<Pressable onPress={handleClose} disabled={isDeletingAccount}>
						<AText className="underline">{t('_account.cancel')}</AText>
					</Pressable>
				</View>
			</View>
		</AModal>
	);
}
