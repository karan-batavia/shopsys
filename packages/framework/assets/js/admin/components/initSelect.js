import Register from '../../common/utils/Register';
import TomSelect from 'tom-select';
import Translator from 'bazinga-translator';

export function initSelect() {
    document.querySelectorAll('select').forEach((el) => {
        const settings = {};

        if (el.hasAttribute('multiple')) {
            // @todo not translated
            settings.plugins = { remove_button: { title: Translator.trans('Remove') } };
        }

        new TomSelect(el, settings);
    });
}

new Register().registerCallback(initSelect, 'initSelect');
