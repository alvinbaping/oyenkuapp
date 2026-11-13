const examples = {
  chat: ['CHAT', 'Beli kopi susu 25 ribu.', 'Kopi susu', 'Rp25.000', 'Tulis seperti ngobrol. Periksa nama dan nominal sebelum simpan.'],
  voice: ['SUARA', '“Tadi makan seblak sepuluh ribu.”', 'Seblak', 'Rp10.000', 'Ucapkan transaksinya, lalu lengkapi draf jika ada detail yang kurang.'],
  scan: ['STRUK', 'Kedai Rasa · Total bayar 42.000', 'Kedai Rasa', 'Rp42.000', 'Foto atau pilih struk. Cocokkan nama toko dan total dengan struknya.'],
  manual: ['MANUAL', 'Nama: Parkir · Dompet: Tunai', 'Parkir', 'Rp5.000', 'Isi detail langsung saat kamu sudah tahu nominal dan dompetnya.'],
};
const buttons = [...document.querySelectorAll('[data-demo]')];
const fields = ['kind', 'input', 'name', 'amount', 'copy'];
for (const button of buttons) {
  button.addEventListener('click', () => {
    const example = examples[button.dataset.demo];
    for (const option of buttons) option.setAttribute('aria-pressed', String(option === button));
    fields.forEach((field, index) => {
      document.querySelector('#demo-' + field).textContent = index === 0 ? 'CONTOH ' + example[index] : example[index];
    });
  });
}
const releaseUrl = '';
if (releaseUrl) {
  const link = document.querySelector('#release-link');
  link.href = releaseUrl;
  link.hidden = false;
  document.querySelector('#release-status').hidden = true;
}

const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const artwork = document.querySelector('.hero-art');

const oyen = document.querySelector('.oyen-button');
const chat = document.querySelector('#oyen-chat');
const message = document.querySelector('#oyen-message');
const greetings = [
  'Halo, aku Oyen. Kenalan yuk!',
  'Mau aku bantu catat pengeluaranmu?',
  'Habis jajan apa hari ini?',
  'Kopi 25 ribu? Yuk, catat.',
  'Struknya masih ada? Coba scan.',
  'Lagi nabung buat apa?',
  'Baru gajian? Yuk langsung catat!',
  'Males ngetik? Bilang aja tadi habis berapa. Aku dengerin.',
];
let remaining = greetings.slice(1);
let previous;
function resetGaze() {
  oyen.style.removeProperty('--gaze-x');
  oyen.style.removeProperty('--gaze-y');
}
artwork.addEventListener('pointermove', (event) => {
  if (motion.matches || event.pointerType !== 'mouse') return;
  const rect = oyen.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height * .57;
  const distance = Math.max(70, Math.hypot(x, y));
  oyen.style.setProperty('--gaze-x', (4 * x / distance) + 'px');
  oyen.style.setProperty('--gaze-y', (3 * y / distance) + 'px');
});
artwork.addEventListener('pointerleave', resetGaze);
motion.addEventListener('change', resetGaze);
oyen.addEventListener('click', () => {
  if (!remaining.length) remaining = [...greetings];
  const choices = remaining.filter(item => item !== previous);
  const next = previous ? choices[Math.floor(Math.random() * choices.length)] : greetings[0];
  if (previous) remaining.splice(remaining.indexOf(next), 1);
  previous = next;
  resetGaze();
  chat.hidden = false;
  message.textContent = next;
  react();
});
document.querySelector('#oyen-dismiss').addEventListener('click', () => {
  chat.hidden = true;
  delete oyen.dataset.expression;
  bounce?.cancel();
  oyen.focus();
});

oyen.dataset.ready = '';

const expressions = ['wink', 'happy', 'surprised', 'thinking', 'shy'];
const pose = oyen.querySelector('.oyen-pose');
let unseenExpressions = [];
let bounce;

function react() {
  if (!unseenExpressions.length) unseenExpressions = [...expressions];
  const alternatives = unseenExpressions.filter(face => face !== oyen.dataset.expression);
  const choices = alternatives.length ? alternatives : unseenExpressions;
  const expression = choices[Math.floor(Math.random() * choices.length)];
  unseenExpressions.splice(unseenExpressions.indexOf(expression), 1);
  oyen.dataset.expression = expression;

  bounce?.cancel();
  if (motion.matches) return;
  const tilt = expression === 'thinking' ? -3 : expression === 'shy' ? 2 : 0;
  bounce = pose.animate([
    { transform: 'none', offset: 0 },
    { transform: 'translateY(2px) scale(1.035,.96)', offset: .16, easing: 'ease-out' },
    { transform: 'translateY(-13px) rotate(' + tilt + 'deg) scale(.98,1.035)', offset: .43, easing: 'ease-in' },
    { transform: 'translateY(1px) scale(1.025,.98)', offset: .73, easing: 'ease-out' },
    { transform: 'translateY(-3px)', offset: .86 },
    { transform: 'none', offset: 1 },
  ], { duration: 420 });
}
motion.addEventListener('change', () => { if (motion.matches) bounce?.cancel(); });
