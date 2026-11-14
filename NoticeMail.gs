// NOTICE PICTURES + NOTICE EMAIL. Separate file. Needs the OwnerEmails file (oeContacts).

function noticeImgFolder() {
  const p = PropertiesService.getScriptProperties(), id = p.getProperty('notice_folder');
  if (id) { try { const f = DriveApp.getFolderById(id); if (!f.isTrashed()) return f; } catch (e) {} }
  const f = DriveApp.createFolder('Mahitha Elite notice pictures');
  p.setProperty('notice_folder', f.getId());
  return f;
}
function noticeImgUrl(id) { return id ? 'https://lh3.googleusercontent.com/d/' + id + '=w1000' : ''; }

/** Saves the notice picture in Drive (anyone with the link can view it, so the app, phone notification and email can show it). */
function saveNoticeImage(photo) {
  if (!photo) return { id: '', failed: false };
  try {
    const id = savePhotos([{ data: photo }], '', noticeImgFolder(), 1, 'notice')[0] || '';
    if (id) DriveApp.getFileById(id).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return { id: id, failed: !id };
  } catch (e) { console.error('Notice picture failed: ' + e); return { id: '', failed: true }; }
}

function ntEsc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

/** One email to all owners that have an email in the Contacts tab (hidden in BCC). Returns how many owners got it. */
function emailNotice(title, body, imgId, onlyAdmin) {
  const c = oeContacts(), list = [];
  Object.keys(c).forEach(function (f) { c[f].emails.forEach(function (e) { if (list.indexOf(e) < 0) list.push(e); }); });
  const bcc = onlyAdmin ? [] : list.slice(0, 90);   // Gmail allows about 100 recipients a day in total
  if (!bcc.length && !onlyAdmin) return 0;
  const app = (typeof OE_APP_URL !== 'undefined' && OE_APP_URL) ? OE_APP_URL : '';
  const opt = {
    to: adminEmails()[0],
    subject: (onlyAdmin ? '[TEST] ' : '') + '[Mahitha Elite] Notice: ' + title,
    name: CONFIG.ASSOCIATION
  };
  if (bcc.length) opt.bcc = bcc.join(',');
  let img = '';
  if (imgId) { try { opt.inlineImages = { notice: DriveApp.getFileById(imgId).getBlob().setName('notice.jpg') }; img = '<p><img src="cid:notice" style="max-width:100%;border-radius:8px"></p>'; } catch (e) {} }
  opt.body = title + '\n\n' + body + (app ? '\n\nOpen the app: ' + app : '') + '\n\n- ' + CONFIG.ASSOCIATION;
  opt.htmlBody = '<div style="font-family:Arial,sans-serif;max-width:520px"><div style="background:#0B2545;color:#fff;padding:12px 16px;border-radius:8px 8px 0 0"><b>' + ntEsc(CONFIG.ASSOCIATION) + '</b><br><span style="font-size:12px;color:#C9D6EA">Notice \u00B7 \u0C28\u0C4B\u0C1F\u0C40\u0C38\u0C41</span></div>' +
    '<div style="border:1px solid #ccd;border-top:0;padding:14px 16px"><h3 style="margin:0 0 8px">' + ntEsc(title) + '</h3>' +
    '<p style="white-space:pre-wrap;line-height:1.5">' + ntEsc(body) + '</p>' + img +
    (app ? '<p><a href="' + ntEsc(app) + '">Open the app</a></p>' : '') + '</div></div>';
  MailApp.sendEmail(opt);
  return bcc.length;
}

// SAFE test: sends a sample notice mail to YOU only.
function testNoticeEmail() { return emailNotice('Test notice', 'This is a test notice mail.', '', true); }
