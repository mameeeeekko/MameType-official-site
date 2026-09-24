/* =====================================================
   CONTACT FORM — Formspree AJAX
   -----------------------------------------------------
   Formspree の Form ID を変更する場合は、
   下の FORMSPREE_FORM_ID だけを書き換える。
   ===================================================== */

const FORMSPREE_FORM_ID = 'xjykrzqz';

(function () {
  // Formspree公式AJAXライブラリ（@formspree/ajax）を読み込む前に
  // 初期化を予約しておくためのキュー。公式スニペットと同じ仕組み。
  window.formspree = window.formspree || function () {
    (formspree.q = formspree.q || []).push(arguments);
  };

  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('contact-status');
  const submitButton = form.querySelector('[type="submit"]');
  const typeInputs = form.querySelectorAll('input[name="inquiry_type"]');
  const bugFields = form.querySelectorAll('[data-bug-only]');
  const osSelect = document.getElementById('contact-os');
  const browserSelect = document.getElementById('contact-browser');

  const BUG_TYPE = 'バグ報告';

  const MESSAGES = {
    sending: '送信中…',
    success: 'お問い合わせを送信しました。ありがとうございます。',
    error: '送信に失敗しました。時間をおいて、もう一度お試しください。'
  };

  function selectedType() {
    for (let i = 0; i < typeInputs.length; i++) {
      if (typeInputs[i].checked) return typeInputs[i].value;
    }
    return '';
  }

  // バグ報告のときだけ「使用OS」「使用ブラウザ」を表示し、送信対象にする。
  // 非表示のあいだは disabled にすることで FormData に含まれず、送信されない。
  function updateBugFields() {
    const isBug = selectedType() === BUG_TYPE;

    bugFields.forEach(el => {
      el.classList.toggle('is-hidden', !isBug);
    });

    [osSelect, browserSelect].forEach(select => {
      if (!select) return;
      select.disabled = !isBug;
      select.required = isBug;
      if (!isBug) select.value = '';
    });
  }

  function setStatus(state, message) {
    if (!statusEl) return;
    statusEl.textContent = message || '';
    statusEl.className = message ? 'contact-status is-visible is-' + state : 'contact-status';
  }

  // ライブラリ既定の disable / enable はボタンの中身をテキストへ置き換えて
  // <span>→</span> が失われるため、見た目を保つ独自実装を使用する。
  function setBusy(isBusy) {
    form.setAttribute('aria-busy', String(isBusy));
    if (submitButton) submitButton.disabled = isBusy;
  }

  typeInputs.forEach(input => {
    input.addEventListener('change', updateBugFields);
  });

  updateBugFields();

  formspree('initForm', {
    formElement: '#contact-form',
    formId: FORMSPREE_FORM_ID,

    disable: () => { setBusy(true); },
    enable: () => { setBusy(false); },

    onSubmit: () => {
      setStatus('sending', MESSAGES.sending);
    },
    onSuccess: () => {
      setStatus('success', MESSAGES.success);
      form.reset();
      updateBugFields();
    },
    onError: () => {
      setStatus('error', MESSAGES.error);
    },
    onFailure: () => {
      setStatus('error', MESSAGES.error);
    }
  });

  // ライブラリが読み込めなかった場合は、意図しないページ遷移を防いでエラー表示にする。
  // （読み込めた場合は window.formspree が公式の関数に置き換わり、q は参照されない）
  window.addEventListener('load', () => {
    if (window.formspree && window.formspree.q && window.formspree.q.length) {
      form.addEventListener('submit', event => {
        event.preventDefault();
        setStatus('error', MESSAGES.error);
      });
    }
  });
})();
