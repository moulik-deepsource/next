import {useNotificationsStore} from '@/stores'
import i18n from '@/lang';

export default function copy(str: string) {
	const store = useNotificationsStore();

	store.add({
		title: i18n.t('copy_to_clipboard'),
		type: 'success',
		icon: 'checked'
	});

	const el = document.createElement('textarea');
	el.value = str;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);
}
