# Hướng dẫn Deploy Static Website với S3 + CloudFront + SSL

## 📋 Mục lục
1. [Tổng quan](#tổng-quan)
2. [Chuẩn bị](#chuẩn-bị)
3. [Setup S3 Bucket](#setup-s3-bucket)
4. [Setup CloudFront Distribution](#setup-cloudfront-distribution)
5. [Setup SSL Certificate](#setup-ssl-certificate)
6. [Cấu hình DNS](#cấu-hình-dns)
7. [Deploy Website](#deploy-website)
8. [Troubleshooting](#troubleshooting)
9. [Maintenance & Updates](#maintenance--updates)

---

## 🎯 Tổng quan

### Kiến trúc
```
User → CloudFront (CDN) → S3 Website Endpoint → Static Files
     ↓
   Custom Domain + SSL
```

### Lợi ích
- **Performance**: CloudFront CDN toàn cầu
- **Security**: HTTPS với SSL certificate
- **Cost**: Chỉ trả theo sử dụng
- **Scalability**: Tự động scale
- **Caching**: Giảm tải S3

---

## 🛠️ Chuẩn bị

### Yêu cầu
- AWS Account
- Domain name (ví dụ: `example.com`)
- Static website files (Next.js export, React build, etc.)

### Tools cần thiết
- AWS CLI (optional)
- Domain DNS management access

---

## 🗄️ Setup S3 Bucket

### Bước 1: Tạo S3 Bucket
1. **AWS Console** → **S3** → **Create bucket**
2. **Bucket name**: `your-website-bucket` (unique globally)
3. **Region**: Chọn region gần nhất
4. **Block Public Access**: **Uncheck** (sẽ public sau)
5. **Create bucket**

### Bước 2: Enable Static Website Hosting
1. **S3** → chọn bucket → **Properties**
2. **Static website hosting** → **Edit**
3. **Enable** → **Host a static website**
4. **Index document**: `index.html`
5. **Error document**: `index.html` (cho SPA routing)
6. **Save changes**

> Mục đích / Khi nào dùng / Sửa lỗi gì
- **Mục đích**: Cho phép S3 phục vụ website tĩnh qua Website Endpoint.
- **Khi nào dùng**: Luôn bật với static site (Next export/React build).
- **Sửa lỗi**: 403 hoặc 404 khi truy cập trực tiếp S3 Website URL.

### Bước 3: Set Bucket Policy (Public Read)
1. **S3** → bucket → **Permissions** → **Bucket policy**
2. **Thêm policy**:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```
3. **Save changes**

> Mục đích / Khi nào dùng / Sửa lỗi gì
- **Mục đích**: Cho phép người dùng (và CloudFront) đọc các object public từ S3 Website Endpoint.
- **Khi nào dùng**: Khi dùng S3 Website Endpoint (không dùng OAC/Private bucket).
- **Sửa lỗi**: 403 AccessDenied khi truy cập file `index.html`, CSS/JS.

### Bước 4: Upload Files
1. Upload toàn bộ static files vào bucket
2. **Đảm bảo có** `index.html` ở gốc bucket
3. **Cấu trúc thư mục**:
```
bucket/
├── index.html
├── _next/
│   ├── static/
│   └── ...
├── css/
├── js/
└── images/
```

---

## ☁️ Setup CloudFront Distribution

### Bước 1: Tạo CloudFront Distribution
1. **AWS Console** → **CloudFront** → **Create distribution**
2. **Origin domain**: `your-bucket.s3-website-region.amazonaws.com`
3. **Origin path**: (để trống)
4. **Protocol**: **HTTP only** (S3 Website endpoint chỉ hỗ trợ HTTP)
5. **HTTP port**: `80`
6. **HTTPS port**: `443`

> Mục đích / Khi nào dùng / Sửa lỗi gì
- **Mục đích**: Tạo CDN cho website tĩnh, tăng tốc tải trang toàn cầu.
- **Khi nào dùng**: Hầu hết sản phẩm production/public.
- **Sửa lỗi**: Chậm do truy cập trực tiếp S3; 403 nếu trỏ nhầm REST endpoint với bucket public.

### Bước 2: Cấu hình Distribution Settings
1. **Price class**: `Use only US, Canada and Europe` (tiết kiệm chi phí)
2. **Alternate domain names (CNAME)**: (để trống tạm thời)
3. **Custom SSL certificate**: (để trống tạm thời)
4. **Default root object**: `index.html`
5. **Comment**: `Website for example.com`

> Mục đích / Khi nào dùng / Sửa lỗi gì
- **Default root object**: đảm bảo truy cập `/` trả về `index.html` (sửa lỗi 403/404 ở root).
- **Price class**: tối ưu chi phí; chọn All locations khi cần hiệu năng tối đa toàn cầu.

### Bước 3: Behaviors (Optional)
1. **Path pattern**: `*` (default)
2. **Viewer protocol policy**: `Redirect HTTP to HTTPS`
3. **Cache policy**: `Managed-CachingOptimized`
4. **Origin request policy**: `Managed-CORS-S3Origin`

### Bước 4: Create Distribution
1. **Create distribution**
2. **Đợi 5-15 phút** để deploy
3. **Lưu Distribution ID** (ví dụ: `ED7JFYRHQZIYZ`)

---

## 🔐 Setup SSL Certificate

### Bước 1: Request Certificate
1. **AWS Console** → **Certificate Manager** (region: **N. Virginia/us-east-1**)
2. **Request certificate** → **Request public certificate**
3. **Domain names**: 
   - `www.example.com` (hoặc subdomain như `app.example.com`)
   - **Add another name**: `example.com` (optional)
4. **Validation method**: **DNS validation**
5. **Key algorithm**: **RSA 2048**
6. **Request**

> Mục đích / Khi nào dùng / Sửa lỗi gì
- **Mục đích**: Cấp SSL miễn phí cho domain khi dùng cùng CloudFront.
- **Khi nào dùng**: Bất cứ khi nào gắn custom domain với HTTPS.
- **Sửa lỗi**: Trình duyệt cảnh báo "Not secure" hoặc không có ổ khóa HTTPS.

### Bước 2: DNS Validation
1. **Certificate Manager** → chọn certificate
2. **Domains tab** → copy **CNAME name** và **CNAME value**
3. **DNS Management** → thêm CNAME record:
   - **Name**: `_abc123.www` (chỉ phần trước domain)
   - **Type**: `CNAME`
   - **Value**: `_xyz789.acm-validations.aws`
   - **TTL**: `300`
4. **Save** và đợi 5-30 phút
5. **ACM** → bấm **Retry validation**
6. **Đợi status** chuyển sang **Issued**

> Mục đích / Khi nào dùng / Sửa lỗi gì
- **Mục đích**: Chứng minh sở hữu domain bằng DNS để cấp cert.
- **Khi nào dùng**: Sau khi tạo certificate mới.
- **Sửa lỗi**: Certificate mãi `Pending validation` khiến CloudFront không thể dùng cert.

---

## 🌐 Cấu hình DNS

### Bước 1: Trỏ Domain về CloudFront
1. **DNS Management** → thêm CNAME record:
   - **Name**: `www` (hoặc subdomain)
   - **Type**: `CNAME`
   - **Value**: `d1q6yqgcfll9qh.cloudfront.net` (Distribution domain)
   - **TTL**: `300`

> Mục đích / Khi nào dùng / Sửa lỗi gì
- **Mục đích**: Trỏ domain/subdomain về CloudFront.
- **Khi nào dùng**: Sau khi CloudFront đã sẵn sàng phục vụ website.
- **Sửa lỗi**: Domain không hiển thị nội dung (404/403) hoặc vẫn trỏ về IP cũ.

### Bước 2: Domain Root (Optional)
Nếu muốn dùng `example.com` (không www):
- **Cần ALIAS/ANAME record** (Route53 hỗ trợ)
- Hoặc dùng **www** redirect về root

---

## 🔗 Gắn SSL vào CloudFront

### Bước 1: Update CloudFront Distribution
1. **CloudFront** → Distribution → **General** → **Edit**
2. **Alternate domain names (CNAME)**: `www.example.com`
3. **Custom SSL certificate**: chọn certificate đã **Issued**
4. **Security policy**: `TLSv1.3_2025` (hoặc `TLSv1.2_2021`)
5. **Supported HTTP versions**: `HTTP/2` ✅
6. **IPv6**: `On` ✅
7. **Default root object**: `index.html`
8. **Save changes**

> Mục đích / Khi nào dùng / Sửa lỗi gì
- **Alternate domain names**: khai báo domain để CloudFront phục vụ. Bắt buộc phải khớp với cert.
- **Custom SSL certificate**: gắn SSL đã Issued để bật HTTPS cho domain.
- **Sửa lỗi**: 403/Not secure khi đã có cert nhưng CloudFront chưa khai báo CNAME.

### Bước 2: Đợi Deploy
- **Status**: In Progress → Deployed (5-15 phút)
- **Test**: `https://www.example.com`

### Bật chuyển hướng HTTP → HTTPS (khuyến nghị)
Nếu truy cập bằng `http://` trình duyệt sẽ báo "Không bảo mật". Hãy bật tự động chuyển sang `https://` như sau:

1. Vào **CloudFront** → chọn **Distribution** → tab **Behaviors**
2. Chọn **Default behavior** → **Edit**
3. Ở **Viewer protocol policy** chọn: **Redirect HTTP to HTTPS**
4. **Save changes** và đợi deploy (5–10 phút)
5. Nếu cần, vào tab **Invalidations** → **Create invalidation** với **Object paths**: `/*`
6. Truy cập lại bằng `https://your-domain` để kiểm tra ổ khóa bảo mật

> Mục đích / Khi nào dùng / Sửa lỗi gì
- **Mục đích**: Buộc mọi truy cập HTTP chuyển sang HTTPS để an toàn và SEO tốt hơn.
- **Khi nào dùng**: Sau khi đã gắn SSL + domain vào CloudFront.
- **Sửa lỗi**: Trình duyệt báo "Không bảo mật" khi người dùng gõ `http://...`.

---

## 🚀 Deploy Website

### Bước 1: Build Static Files
```bash
# Next.js
npm run build
# Files sẽ trong thư mục 'out'

# React
npm run build
# Files sẽ trong thư mục 'build'
```

### Bước 2: Upload to S3
```bash
# AWS CLI
aws s3 sync ./out s3://your-bucket --delete

# Hoặc upload manual qua S3 Console
```

### Bước 3: Invalidate CloudFront Cache
1. **CloudFront** → Distribution → **Invalidations**
2. **Create invalidation**
3. **Object paths**: `/*`
4. **Create invalidation**

> Mục đích / Khi nào dùng / Sửa lỗi gì
- **Mục đích**: Xóa cache cũ trên edge để phân phát phiên bản mới.
- **Khi nào dùng**: Sau khi upload build mới, đổi cấu hình quan trọng (domain/behaviors/headers).
- **Sửa lỗi**: Website không cập nhật; CSS/JS cũ vẫn hiển thị.

---

## 🔧 Troubleshooting

### Lỗi 403 Forbidden
**Nguyên nhân**: S3 bucket không public hoặc CloudFront không truy cập được

**Giải pháp**:
1. Kiểm tra **S3 bucket policy** có đúng không
2. Kiểm tra **CloudFront origin** có trỏ đúng S3 Website endpoint không
3. Kiểm tra **Default root object** = `index.html`

### Lỗi SSL Certificate
**Nguyên nhân**: Certificate chưa Issued hoặc sai region

**Giải pháp**:
1. Certificate phải ở **us-east-1** (N. Virginia)
2. DNS validation phải hoàn thành
3. **Retry validation** trong ACM

### Website không cập nhật
**Nguyên nhân**: CloudFront cache

**Giải pháp**:
1. **Invalidate cache**: `/*`
2. Hoặc đợi TTL hết hạn

### CSS/JS không load
**Nguyên nhân**: CORS hoặc cache

**Giải pháp**:
1. Kiểm tra **S3 bucket policy** cho phép CloudFront
2. **Invalidate cache** cho `/_next/*`
3. Kiểm tra **Content-Type** của files

---

## 🔄 Maintenance & Updates

### Cập nhật Website
1. **Build** static files mới
2. **Upload** lên S3 (sync hoặc manual)
3. **Invalidate** CloudFront cache
4. **Test** website

### Thay đổi Domain
1. **Request** certificate mới cho domain mới
2. **Update** CloudFront CNAME
3. **Update** DNS records
4. **Test** domain mới

### Thay đổi SSL Certificate
1. **Request** certificate mới
2. **Validate** DNS
3. **Update** CloudFront certificate
4. **Test** HTTPS

### Monitor Costs
1. **CloudFront**: Data transfer + Requests
2. **S3**: Storage + Requests
3. **Certificate Manager**: Free (nếu dùng với AWS services)

### Backup Strategy
1. **S3 versioning** (optional)
2. **Cross-region replication** (optional)
3. **Local backup** của source code

---

## 📊 Best Practices

### Performance
- **Enable compression** trong CloudFront
- **Set appropriate TTL** cho static assets
- **Use HTTP/2** và **HTTP/3**
- **Optimize images** trước khi upload

### Security
- **Use HTTPS only**
- **Set security headers** (CSP, HSTS)
- **Regular certificate renewal**
- **Monitor access logs**

### Cost Optimization
- **Choose right price class** (US/Europe vs All locations)
- **Set appropriate cache TTL**
- **Compress files** trước upload
- **Monitor usage** trong Cost Explorer

### Monitoring
- **CloudWatch metrics** cho CloudFront
- **S3 access logs** (optional)
- **Uptime monitoring** (third-party)

---

## 🆘 Emergency Procedures

### Website Down
1. **Check** CloudFront status
2. **Check** S3 bucket access
3. **Check** DNS resolution
4. **Invalidate** cache nếu cần

### SSL Expired
1. **Request** certificate mới
2. **Validate** DNS
3. **Update** CloudFront
4. **Test** HTTPS

### High Traffic
1. **Check** CloudFront limits
2. **Consider** multiple distributions
3. **Optimize** caching strategy
4. **Scale** S3 if needed

---

## 📞 Support Resources

- **AWS Documentation**: https://docs.aws.amazon.com/
- **CloudFront Guide**: https://docs.aws.amazon.com/cloudfront/
- **S3 Static Website**: https://docs.aws.amazon.com/s3/latest/userguide/WebsiteHosting.html
- **Certificate Manager**: https://docs.aws.amazon.com/acm/

---

*Tài liệu này được tạo để hướng dẫn deploy static website với S3 + CloudFront + SSL. Cập nhật lần cuối: 2025*
