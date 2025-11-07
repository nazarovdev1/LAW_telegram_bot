# TODO - Telegram Bot Xabarlarni Saqlash

- [x] Foydalanuvchi xabarlarini saqlash funksiyasini tahlil qilish
- [x] saveUserMessage funksiyasini yaratish (faqat user_id va message)
- [x] Bot har bir xabarda saveUserMessage ni chaqirishi
- [x] reports.json faylida ma'lumotlarni to'g'ri saqlash
- [x] Eski ma'lumotlarni saqlab qolish va yangilarini qo'shish
- [x] Har bir foydalanuvchi matn xabari uchun saveUserMessage chaqirish
- [x] Bot to'g'ri ishlashini ta'minlash

## Yaratilgan Funksionallik:

1. **saveUserMessage funksiyasi** - har bir foydalanuvchi xabarini user_id va message ko'rinishida saqlaydi
2. **Har bir matn xabari uchun** - foydalanuvchi har qanday matn yuborganda avtomatik saqlanadi
3. **reports.json faylida** - ma'lumotlar array ko'rinishida saqlanadi
4. **Eski ma'lumotlar** - o'chirilmasdan, yangilari qo'shiladi

## Implementatsiya Joyi:
Har bir matn xabari uchun `bot.on('text')` handler ichida `saveUserMessage(userId, messageText)` chaqiriladi.
