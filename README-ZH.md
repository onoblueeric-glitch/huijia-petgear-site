# HUIJIA PET 静态独立站

这是一个可以直接上传 GitHub，并通过 Vercel 部署的纯静态网站包。

## 一、上线前先修改公司资料

打开：

`assets/js/site-config.js`

修改以下配置：

- `siteUrl`：最终购买的网站域名
- `email`：业务邮箱
- `whatsappNumber`：仅数字的 WhatsApp 号码，包含国家代码
- `whatsappDisplay`：网站上显示的 WhatsApp 号码
- `videoUrl`：工厂视频或 YouTube 视频地址
- `formEndpoint`：Formspree、Web3Forms 或公司 CRM/API 的表单接口

当 `formEndpoint` 留空时，询盘表单会调用访客的邮件客户端，将询盘内容发送到配置的业务邮箱。

## 二、替换图片

当前页面保留了原始首页中的 Unsplash 临时图片。正式上线前必须使用 HUIJIA 自有或已取得授权的素材替换：

- 产品白底图
- Harness、Collar、Leash 套装图
- 工厂和生产线照片
- 拉力测试、质检照片
- 真实证书
- 真实客户案例

在 `index.html` 和 `assets/css/styles.css` 中搜索 `images.unsplash.com` 即可找到全部临时图片。

## 三、核实页面数据

正式上线前必须核实并修改以下示例数据：

- 成立年份和 OEM 年限
- 产品设计数量
- 出口市场数量
- 打样周期
- MOQ
- 证书名称
- 客户评价
- 客户案例

无法提供证据的内容应删除，不建议直接公开示例证书或示例评价。

## 四、本地预览

可以直接双击打开 `index.html`，也可以在项目目录运行：

```bash
npm run dev
```

## 五、上传 GitHub

在项目目录运行：

```bash
git init
git add .
git commit -m "Initial HUIJIA PET website"
git branch -M main
git remote add origin 你的GitHub仓库地址
git push -u origin main
```

也可以在 GitHub 网页新建仓库后，直接上传本网站包内的全部文件。

## 六、部署 Vercel

1. 登录 Vercel。
2. 点击 **Add New → Project**。
3. 导入刚才的 GitHub 仓库。
4. Framework Preset 选择 **Other**。
5. Build Command 留空。
6. Output Directory 留空或填写 `.`。
7. 点击 Deploy。
8. 在项目的 **Settings → Domains** 中绑定已购买的域名。

## 七、更换最终域名

当前代码已使用 `https://www.huijiapetgear.com` 作为正式主域名写入以下文件：

- `index.html`
- `assets/js/site-config.js`
- `robots.txt`
- `sitemap.xml`

Vercel 中应把裸域 `huijiapetgear.com` 永久重定向到 `www.huijiapetgear.com`。若以后更换域名，请全局搜索 `huijiapetgear.com` 并统一替换。
