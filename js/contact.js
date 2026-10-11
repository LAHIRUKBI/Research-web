/* =========================================================
   SmartAgri — Contact Form & General Email Template Generator
   Fulfills website.pdf Page 15 criteria
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const templatePreview = document.getElementById('emailTemplatePreview');
  const copyBtn = document.getElementById('btnCopyTemplate');
  const openMailBtn = document.getElementById('btnOpenMail');

  function updateTemplate() {
    if (!templatePreview) return;

    const name = document.getElementById('senderName')?.value.trim() || '[Your Full Name]';
    const email = document.getElementById('senderEmail')?.value.trim() || '[Your Email Address]';
    const affiliation = document.getElementById('senderAffiliation')?.value.trim() || '[Institution / Organization]';
    const category = document.getElementById('inquiryCategory')?.value || 'Research Collaboration';
    const subject = document.getElementById('emailSubject')?.value.trim() || 'Inquiry regarding SmartAgri Project (R26-IT-063)';
    const message = document.getElementById('emailMessage')?.value.trim() || 'We are interested in discussing potential collaboration on your AI and IoT agriculture research models.';

    const bodyText = `Dear SmartAgri Research Team (R26-IT-063),

My name is ${name} from ${affiliation}.
I am writing to inquire regarding ${category}.

Subject: ${subject}

Message:
${message}

Sincerely,
${name}
Contact: ${email}`;

    templatePreview.textContent = bodyText;

    if (openMailBtn) {
      const mailtoUrl = `mailto:lahiruilangasinha@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      openMailBtn.setAttribute('href', mailtoUrl);
    }
  }

  if (form) {
    ['input', 'change'].forEach(evt => form.addEventListener(evt, updateTemplate));
    updateTemplate();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showSitePopup('success', 'Message Prepared', 'Your inquiry template has been generated and is ready to send via your email client.');
    });
  }

  if (copyBtn && templatePreview) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(templatePreview.textContent).then(() => {
        showSitePopup('success', 'Copied to Clipboard', 'The generated email template has been copied successfully.');
      }).catch(() => {
        alert('Template copied.');
      });
    });
  }
});
