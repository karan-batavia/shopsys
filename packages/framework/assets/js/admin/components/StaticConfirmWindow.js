import Register from '../../common/utils/Register';
import ModalWindow from '../utils/ModalWindow';
import Translator from 'bazinga-translator';

export default class StaticConfirmWindow {
    constructor(element) {
        $(element).on('click', (event) => this.showWindow(event));
    }

    showWindow(event) {
        event.preventDefault();

        const content =
            '<h3>' +
            Translator.trans('Are you sure?') +
            '</h3>' +
            '<div class="text-secondary">' +
            $(event.currentTarget).data('confirm-message') +
            '</div>';

        // eslint-disable-next-line no-new
        new ModalWindow({
            content: content,
            buttonCancel: true,
            buttonContinue: true,
            modalStatus: $(event.currentTarget).data('confirm-status') ?? null,
            urlContinue: $(event.currentTarget).data('confirm-continue-url'),
        });
    }

    static init($container) {
        $container.filterAllNodes('a[data-confirm-window]').each((idx, element) => {
            // eslint-disable-next-line no-new
            new StaticConfirmWindow(element);
        });
    }
}

new Register().registerCallback(StaticConfirmWindow.init, 'StaticConfirmWindow.init');
