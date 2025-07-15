<template>
  <footer class="footer-wrapper">
    <div class="footer-header">
      <h2>QUẢN LÝ MƯỢN TRẢ SÁCH PTW</h2>
    </div>

    <div class="footer-icons">
      <!-- Map -->
      <div class="footer-icon-item">
        <a href="https://maps.app.goo.gl/38x4YKtZq9NjNzoW9" target="_blank" rel="noopener">
          <img src="https://cdn-icons-png.flaticon.com/512/535/535239.png" alt="Map" />
        </a>
        <p>Map</p>
      </div>

      <!-- Phone -->
      <div class="footer-icon-item">
        <a href="tel:+0776560730">
          <img src="https://cdn-icons-png.flaticon.com/512/597/597177.png" alt="Phone" />
        </a>
        <p>Phone</p>
      </div>

      <!-- Email -->
      <div class="footer-icon-item">
        <a href="mailto:nhutb2203520@student.ctu.edu.vn">
          <img src="https://cdn-icons-png.flaticon.com/512/561/561127.png" alt="Email" />
        </a>
        <p>Email</p>
      </div>

      <!-- Facebook -->
      <div class="footer-icon-item">
        <a href="https://facebook.com" target="_blank" rel="noopener">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" />
        </a>
        <p>Facebook</p>
      </div>

      <!-- YouTube -->
      <div class="footer-icon-item">
        <a href="https://youtube.com" target="_blank" rel="noopener">
          <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" />
        </a>
        <p>YouTube</p>
      </div>
    </div>

    <hr class="divider" />

    <div class="footer-contact">
      <p>📞 0776 560 730 </p>
      <p>🌐 www.phattrienungdungweb.com</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer-wrapper {
  background-color: #23379dac;
  text-align: center;
  padding: 40px 20px;
  font-family: 'Segoe UI', sans-serif;
  color: #ffffff;
}

.footer-header h2 {
  font-size: 24px;
  margin-bottom: 30px;
}

.footer-icons {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
  margin-bottom: 30px;
}

.footer-icon-item {
  max-width: 100px;
  text-align: center;
}

.footer-icon-item a {
  display: inline-block;
}

.footer-icon-item img {
  width: 70px;
  height: 70px;
  background-color: #e2e6ea;
  border-radius: 50%;
  padding: 12px;
  margin-bottom: 8px;
  transition: transform 0.2s;
  cursor: pointer;
}

.footer-icon-item img:hover {
  transform: scale(1.1);
}

.footer-icon-item p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
}

.divider {
  border: none;
  height: 1px;
  background-color: #ffffff;
  width: 80%;
  margin: 20px auto;
}

.footer-contact p {
  margin: 5px 0;
  font-size: 14px;
  color: #ffffff;
}
</style>
