# 🌌 v14 YT Yetkili Alım Botu

![Afiş](https://media.discordapp.net/attachments/1376139007594991719/1409803167218270208/00afc1209656435.67cc349a5ab20.webp?ex=68aeb503&is=68ad6383&hm=28c47b00453b39e8839bb406d0ee4d267ca19c00fe2e377a83324e90ba7ea2a7&=&format=webp&width=688&height=229)


## ✨ Proje Hakkında
v14 YT Yetkili Alım Botu, Discord sunucularında **otomatik yetki yönetimi** sağlayan gelişmiş bir bottur.  
Bot, **config üzerinden ayarlanan yetki sınırlarına göre** kullanıcıların rollerini ve izinlerini otomatik olarak düzenler.  

> Her kategoriye özel rol atama, detaylı log sistemi ve özelleştirilebilir emoji desteği ile profesyonel bir deneyim sunar.

---

## 🌟 Özellikler

| Özellik | Açıklama | Simgeler |
|---------|----------|----------|
| Kategori Bazlı Yetki | Her kategoriye özel rol atama ve izin sistemi | 🛡️ |
| Tam Konfigürasyon Desteği | Config dosyasında her ayarın yetkisini belirleyebilirsin | ⚙️ |
| Özel Emoji ve İkonlar | Klavyede olmayan özel simgeler ve fotoğraflar kullanılabilir | 🌟 |
| Kullanıcı Dostu | Yetki verme ve rol atama işlemleri sadece birkaç komut ile yapılabilir | 🎮 |
| Gelişmiş Log Sistemi | Her yetki değişikliği ve rol ataması kaydedilir, denetim kolaydır | 📜 |

---

## ⚙️ Kurulum

Öncelik olarak `index.js` dosyasının en altına inin. Oradaki:

```js
client.login("DİSCORD BOT TOKEN");
satırına kendi Discord bot tokeninizi ekleyin. Tokeni nasıl alacağınızı bilmeyenler için buradan bakabilirler. https://www.youtube.com/watch?v=S58wYTFru9A

Sonrasında config.json dosyasındaki bilgileri kendinize göre ayarlayın.

git clone https://github.com/wapersh/v14-yt-al-m.git
cd v14-yt-al-m
npm install
node index.js

