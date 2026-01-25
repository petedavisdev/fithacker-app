import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
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

	function handleDelete() {
		if (!isDeletingAccount) {
			deleteAccount(undefined, {
				onSuccess: () => {
					props.onClose();
				},
			});
		}
	}

	return (
		<AModal
			isOpen={props.isOpen}
			onClose={props.onClose}
			onConfirm={handleDelete}
			showCancel={true}
		>
			<View className="p-6 gap-6">
				<AText color="pink" size="2xl" className="font-bold text-center">
					⚠️ {t('_account.deleteAccountTitle')}
				</AText>

				<AText size="base" className="text-center leading-6">
					{t('_account.deleteAccountWarning')}
				</AText>
			</View>
		</AModal>
	);
}
