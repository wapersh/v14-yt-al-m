project:
  name: "v14 YT Yetkili Alım Botu"
  banner: "https://i.imgur.com/yourbanner.png"
  description: >
    v14 YT Yetkili Alım Botu, Discord sunucularında otomatik yetki yönetimi
    sağlayan profesyonel bir bottur.
    Bot, config üzerinden ayarlanan yetki sınırlarına göre kullanıcıların
    rollerini ve izinlerini otomatik olarak düzenler.
  features:
    - name: "Kategori Bazlı Yetki"
      description: "Her kategoriye özel rol atama ve izin sistemi."
      icon: "🛡️"
    - name: "Tam Konfigürasyon Desteği"
      description: "Config dosyasında her ayarın kendi yetkisini belirleyebilirsin."
      icon: "⚙️"
    - name: "Özel Emoji ve İkonlar"
      description: "Normal emoji yerine, klavyede bulunmayan özel simgeler ve fotoğraflar kullanılabilir."
      icon: "🌟"
    - name: "Kullanıcı Dostu"
      description: "Yetki verme ve rol ayarlama işlemleri sadece birkaç komut ile yapılabilir."
      icon: "🎮"
    - name: "Gelişmiş Log Sistemi"
      description: "Her yetki değişikliği ve rol ataması kaydedilir, denetim kolaydır."
      icon: "📜"
  installation:
    steps:
      - "git clone https://github.com/wapersh/v14-yt-al-m.git"
      - "cd v14-yt-al-m"
      - "npm install"
  usage:
    steps:
      - "config.json dosyasını açın ve kategori, rol ve yetki sınırlarını ayarlayın."
      - "Botu başlatın: node index.js"
      - "Bot otomatik olarak config’e göre yetki vermeye başlar."
  developer_notes:
    - "Proje tamamen Node.js ve Discord.js tabanlıdır."
    - "Özel emoji ve görseller için assets klasörünü kullanabilirsiniz."
    - "Her yeni kategori ve rol eklemesi config üzerinden kolayca yapılabilir."
  links:
    github: "https://github.com/wapersh/v14-yt-al-m"
    support_discord: "https://discord.gg/yourserver"
  style_tips:
    - "README banner ve özel simgeler için Imgur veya benzeri CDN kullanın."
    - "Klavyede bulunmayan özel ikonlar ile README’ye profesyonel bir görünüm kazandırabilirsiniz."
