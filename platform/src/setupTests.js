import MutationObserver from '@sheerun/mutationobserver-shim';
import 'translations/i18next';
import translations from 'translations/i18next';

window.MutationObserver = MutationObserver;

translations.init({ lng: 'en' });
