'use strict';

(function () {

  const form       = document.getElementById('postal-form');
  const statusDiv  = document.getElementById('form-status');
  const successMsg = document.getElementById('success-msg');

  if (!form) return; // Salir si no existe el formulario en la página

  /* ─── Helpers ─────────────────────────────────────── */

  /** Muestra u oculta el mensaje de error de un campo */
  function setError(field, errorId, show) {
    const errorEl = document.getElementById(errorId);
    if (!errorEl) return;
    errorEl.style.display = show ? 'block' : 'none';
    if (show) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
  }

  /** Valida si se ha seleccionado una imagen de postal */
  function validarImagen() {
    const selected = form.querySelector('input[name="imagen-postal"]:checked');
    const errorEl  = document.getElementById('img-error');
    if (!selected) {
      errorEl.style.display = 'block';
      return false;
    }
    errorEl.style.display = 'none';
    return true;
  }

  /** Valida campos de texto o email */
  function validarCampo(id, errorId, tipo) {
    const field = document.getElementById(id);
    if (!field) return true;

    const val    = field.value.trim();
    let   valido = true;

    if (tipo === 'email') {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      valido   = val.length > 0 && re.test(val);
    } else {
      valido = val.length > 0;
    }

    setError(field, errorId, !valido);
    return valido;
  }

  /** Valida el checkbox de RGPD */
  function validarRGPD() {
    const cb      = document.getElementById('rgpd');
    const errorEl = document.getElementById('rgpd-error');
    if (!cb.checked) {
      errorEl.style.display = 'block';
      cb.setAttribute('aria-invalid', 'true');
      return false;
    }
    errorEl.style.display = 'none';
    cb.removeAttribute('aria-invalid');
    return true;
  }

  /* ─── Submit ──────────────────────────────────────── */

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const v1 = validarImagen();
    const v2 = validarCampo('nombre-remitente',   'nombre-error',   'texto');
    const v3 = validarCampo('email-remitente',     'email-error',    'email');
    const v4 = validarCampo('nombre-destinatario', 'dest-error',     'texto');
    const v5 = validarCampo('email-destinatario',  'emaildest-error','email');
    const v6 = validarCampo('mensaje-postal',      'mensaje-error',  'texto');
    const v7 = validarRGPD();

    const todosValidos = v1 && v2 && v3 && v4 && v5 && v6 && v7;

    if (!todosValidos) {
      statusDiv.textContent = 'Hay errores en el formulario. Por favor, revisa los campos marcados.';
      // Llevar el foco al primer campo inválido
      const primerError = form.querySelector('[aria-invalid="true"]');
      if (primerError) primerError.focus();
      return;
    }

    // Simular envío exitoso (sin backend)
    statusDiv.textContent = '';
    form.style.display    = 'none';
    successMsg.style.display = 'block';
    successMsg.focus();
  });

  /* ─── Limpiar errores al escribir ────────────────── */

  form.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input', function () {
      el.removeAttribute('aria-invalid');
      const describedBy = el.getAttribute('aria-describedby');
      if (describedBy) {
        describedBy.split(' ').forEach(function (id) {
          const errEl = document.getElementById(id);
          if (errEl && errEl.classList.contains('error-msg')) {
            errEl.style.display = 'none';
          }
        });
      }
    });
  });

}());