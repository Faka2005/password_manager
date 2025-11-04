export default function GeneratePassword(length = 12) :string{
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = upper.toLowerCase();
  const digits = "0123456789";
  const symbols = "!@#$%^&*()_+[]{}<>?";
  const all = upper + lower + digits + symbols;

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * all.length);
    password += all[randomIndex];
  }
  return password;
}
