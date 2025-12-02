--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9 (Homebrew)
-- Dumped by pg_dump version 16.9 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: BookingStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."BookingStatus" AS ENUM (
    'PENDING',
    'CONTACTED',
    'COMPLETED',
    'CANCELLED'
);


--
-- Name: MessageStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."MessageStatus" AS ENUM (
    'NEW',
    'READ',
    'REPLIED',
    'ARCHIVED'
);


--
-- Name: TourType; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TourType" AS ENUM (
    'HAC',
    'UMRE',
    'KULTUR'
);


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'EDITOR'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: BankAccount; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BankAccount" (
    id text NOT NULL,
    "bankName" text NOT NULL,
    "accountName" text NOT NULL,
    iban text NOT NULL,
    branch text,
    logo text,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: BlogPost; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."BlogPost" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text NOT NULL,
    content text NOT NULL,
    image text NOT NULL,
    author text NOT NULL,
    category text NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    "publishedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Booking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Booking" (
    id text NOT NULL,
    name text NOT NULL,
    phone text NOT NULL,
    email text NOT NULL,
    "passengerCount" integer DEFAULT 1 NOT NULL,
    "tourId" text NOT NULL,
    "roomType" text,
    "totalPrice" numeric(10,2),
    status public."BookingStatus" DEFAULT 'PENDING'::public."BookingStatus" NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Certificate; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Certificate" (
    id text NOT NULL,
    title text NOT NULL,
    number text NOT NULL,
    description text,
    icon text DEFAULT 'FileText'::text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ContactMessage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ContactMessage" (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    subject text NOT NULL,
    message text NOT NULL,
    status public."MessageStatus" DEFAULT 'NEW'::public."MessageStatus" NOT NULL,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: ContactSubject; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."ContactSubject" (
    id text NOT NULL,
    name text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: FAQ; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FAQ" (
    id text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: FooterLink; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."FooterLink" (
    id text NOT NULL,
    section text NOT NULL,
    label text NOT NULL,
    href text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: HeroSlide; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HeroSlide" (
    id text NOT NULL,
    title text NOT NULL,
    subtitle text,
    "imageUrl" text NOT NULL,
    "buttonText" text,
    "buttonLink" text,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Itinerary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Itinerary" (
    id text NOT NULL,
    "dayNumber" integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "tourId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: LegalPage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."LegalPage" (
    id text NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: MenuItem; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."MenuItem" (
    id text NOT NULL,
    label text NOT NULL,
    href text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "openInNewTab" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: SiteSettings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SiteSettings" (
    id text DEFAULT 'site_settings'::text NOT NULL,
    "heroTitle" text DEFAULT 'Manevi Yolculuğunuz En Uygun Fiyatlarla Başlasın'::text NOT NULL,
    "heroSubtitle" text DEFAULT 'Hac ve Umre turlarında Türkiye''nin en güvenilir karşılaştırma platformu.'::text NOT NULL,
    "contactPhone" text DEFAULT '+90 555 555 55 55'::text NOT NULL,
    "whatsappNumber" text DEFAULT '+905555555555'::text NOT NULL,
    email text DEFAULT 'info@enucuzhacumre.com'::text NOT NULL,
    address text DEFAULT 'Fatih Sultan Mehmet Mah. İstanbul Cad. No:123 Fatih/İstanbul'::text NOT NULL,
    "instagramUrl" text,
    "facebookUrl" text,
    "twitterUrl" text,
    "youtubeUrl" text,
    "footerText" text DEFAULT '© 2025 En Ucuz Hac Umre. Tüm hakları saklıdır.'::text NOT NULL,
    "tursabNo" text DEFAULT 'A-12345'::text NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "companyStory" text,
    "missionStatement" text,
    "satisfactionRate" integer DEFAULT 98 NOT NULL,
    "totalGuests" integer DEFAULT 50000 NOT NULL,
    "visionStatement" text,
    "yearsExperience" integer DEFAULT 20 NOT NULL,
    "bankWarningText" text,
    "newsletterButtonText" text DEFAULT 'Abone Ol'::text NOT NULL,
    "newsletterDescription" text DEFAULT 'Erken rezervasyon fırsatları ve özel indirimlerden ilk siz haberdar olun.'::text NOT NULL,
    "newsletterTitle" text DEFAULT 'Kampanyalardan Haberdar Olun'::text NOT NULL,
    "pageDescBanka" text DEFAULT 'Güvenli ödeme için banka hesap bilgilerimiz'::text NOT NULL,
    "pageDescBelgeler" text DEFAULT 'Resmi ve yasal tüm belgelerimizle güvenilir hizmet sunuyoruz'::text NOT NULL,
    "pageDescBlog" text DEFAULT 'Hac ve Umre ile ilgili faydalı bilgiler'::text NOT NULL,
    "pageDescIletisim" text DEFAULT 'Sorularınız için bize ulaşın. Size en iyi hizmeti sunmak için buradayız.'::text NOT NULL,
    "pageDescSss" text DEFAULT 'Hac ve Umre ile ilgili merak ettiğiniz soruların cevapları'::text NOT NULL,
    "paymentMethods" text DEFAULT 'Visa,Mastercard,Troy'::text NOT NULL,
    "responseTime" text DEFAULT '24 saat içinde yanıt'::text NOT NULL,
    "workingHours" text DEFAULT 'Pzt - Cmt: 09:00 - 18:00'::text NOT NULL
);


--
-- Name: Tour; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tour" (
    id text NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    currency text DEFAULT 'USD'::text NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    quota integer DEFAULT 40 NOT NULL,
    "bookedSeats" integer DEFAULT 0 NOT NULL,
    "meccaHotel" text,
    "medinaHotel" text,
    "hotelStars" integer DEFAULT 4 NOT NULL,
    "kaabaDistance" integer,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    type public."TourType" DEFAULT 'UMRE'::public."TourType" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: TourExcluded; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TourExcluded" (
    id text NOT NULL,
    item text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "tourId" text NOT NULL
);


--
-- Name: TourImage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TourImage" (
    id text NOT NULL,
    url text NOT NULL,
    alt text,
    "order" integer DEFAULT 0 NOT NULL,
    "tourId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: TourIncluded; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TourIncluded" (
    id text NOT NULL,
    item text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "tourId" text NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    name text NOT NULL,
    role public."UserRole" DEFAULT 'ADMIN'::public."UserRole" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastLogin" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Data for Name: BankAccount; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BankAccount" (id, "bankName", "accountName", iban, branch, logo, "order", "isActive", "createdAt", "updatedAt") FROM stdin;
seed-bank-1	Ziraat Bankası	En Ucuz Hac Umre Turizm Ltd. Şti.	TR12 0001 0012 3456 7890 1234 56	Fatih Şubesi - 1234	/banks/ziraat.png	1	t	2025-11-27 04:09:35.195	2025-12-02 03:15:46.347
seed-bank-2	Vakıfbank	En Ucuz Hac Umre Turizm Ltd. Şti.	TR98 0001 5001 5800 7290 1234 56	Sultanahmet Şubesi - 567	/banks/vakifbank.png	2	t	2025-11-27 04:09:35.196	2025-12-02 03:15:46.349
seed-bank-3	Halkbank	En Ucuz Hac Umre Turizm Ltd. Şti.	TR45 0001 2009 8760 0010 1234 56	Eminönü Şubesi - 890	/banks/halkbank.png	3	t	2025-11-27 04:09:35.196	2025-12-02 03:15:46.349
seed-bank-4	Türkiye İş Bankası	En Ucuz Hac Umre Turizm Ltd. Şti.	TR64 0006 4000 0011 2345 6789 01	Laleli Şubesi - 4321	/banks/isbank.png	4	t	2025-11-27 04:09:35.196	2025-12-02 03:15:46.35
\.


--
-- Data for Name: BlogPost; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."BlogPost" (id, title, slug, excerpt, content, image, author, category, "isPublished", "publishedAt", "createdAt", "updatedAt") FROM stdin;
seed-blog-1	Umre Öncesi Yapılması Gereken Hazırlıklar	umre-oncesi-yapilmasi-gereken-hazirliklar	Umre yolculuğunuza çıkmadan önce yapmanız gereken önemli hazırlıkları bu yazımızda bulabilirsiniz.	Umre ibadeti, Müslümanların hayatlarında çok özel bir yere sahiptir. Bu mübarek yolculuğa çıkmadan önce hem manevi hem de fiziksel hazırlıkların yapılması büyük önem taşır.\n\n## Manevi Hazırlıklar\n\n1. **Niyet**: Umre yolculuğuna çıkmadan önce kalbinizde sağlam bir niyet oluşturun.\n2. **Tövbe ve İstiğfar**: Yolculuk öncesi günahlarınızdan tövbe edin.\n3. **Borçları Ödeme**: Varsa borçlarınızı ödeyin veya alacaklılardan helallik alın.\n4. **Helallik Alma**: Aile ve yakınlarınızdan helallik isteyin.\n\n## Fiziksel Hazırlıklar\n\n1. **Sağlık Kontrolü**: Yolculuk öncesi genel sağlık kontrolünden geçin.\n2. **Aşılar**: Gerekli aşıları yaptırın.\n3. **İlaçlar**: Düzenli kullandığınız ilaçları yeterli miktarda yanınıza alın.\n4. **Rahat Giysiler**: Yürüyüşe uygun, rahat kıyafetler hazırlayın.\n\n## Evrak Hazırlıkları\n\n- Pasaport geçerlilik kontrolü\n- Vize işlemleri\n- Seyahat sigortası\n- Otel ve uçuş belgelerinin çıktıları\n\nBu hazırlıkları tamamladıktan sonra huzurlu bir şekilde yolculuğunuza başlayabilirsiniz.	https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80	Erkan Öztürk	Rehber	t	2025-01-15 00:00:00	2025-11-27 04:09:35.185	2025-12-02 03:15:46.337
seed-blog-2	İhram Nedir ve Nasıl Giyilir?	ihram-nedir-ve-nasil-giyilir	İhram, umre ve hac ibadetlerinin vazgeçilmez bir parçasıdır. İhramın ne olduğunu ve nasıl giyildiğini öğrenin.	İhram, hac ve umre ibadetlerini yerine getirmek için giyilen özel kıyafet ve bu kıyafeti giyerek belirli yasaklara uyma halidir.\n\n## İhram Kıyafeti\n\n### Erkekler İçin\n- **İzar**: Belden aşağıya sarılan dikişsiz bez\n- **Rida**: Omuzlara örtülen dikişsiz bez\n- Ayakkabı: Topuk ve parmak uçları açık terlik veya sandalet\n\n### Kadınlar İçin\nKadınlar için özel bir ihram kıyafeti yoktur. Normal tesettür kıyafetleriyle ihrama girebilirler. Yalnızca yüzlerini örtmemeleri ve eldiven giymemeleri gerekir.\n\n## İhrama Giriş\n\n1. **Gusül Abdesti**: İhrama girmeden önce gusül abdesti alınır.\n2. **İhram Namazı**: İki rekat ihram namazı kılınır.\n3. **Niyet ve Telbiye**: Niyet edilir ve telbiye getirilir.\n\n## İhram Yasakları\n\n- Dikişli elbise giymek (erkekler için)\n- Koku sürmek\n- Saç ve sakal kesmek\n- Tırnak kesmek\n- Avlanmak\n- Nikah kıymak\n\nBu kurallara uyarak ihram halinizi koruyabilirsiniz.	https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80	Erkan Öztürk	Bilgi	t	2025-01-10 00:00:00	2025-11-27 04:09:35.187	2025-12-02 03:15:46.339
seed-blog-3	Mekke ve Medine'de Ziyaret Edilmesi Gereken Yerler	mekke-ve-medinede-ziyaret-edilmesi-gereken-yerler	Kutsal topraklarda bulunduğunuz süre içinde ziyaret etmeniz gereken önemli mekanları keşfedin.	Hac ve umre ziyaretiniz sırasında Mekke ve Medine'de birçok tarihi ve dini açıdan önemli mekanı ziyaret edebilirsiniz.\n\n## Mekke'de Ziyaret Edilecek Yerler\n\n### Mescid-i Haram ve Kabe\nDünyanın en kutsal mescidi ve Müslümanların kıblesi olan Kabe burada bulunmaktadır.\n\n### Hira Mağarası\nHz. Muhammed'e ilk vahyin geldiği yer olan Hira Mağarası, Nur Dağı'nın tepesinde yer alır.\n\n### Sevr Mağarası\nHicret sırasında Hz. Muhammed ve Hz. Ebubekir'in sığındığı mağaradır.\n\n### Cennetu'l-Mualla\nHz. Hatice ve birçok sahabenin medfun olduğu kabristanlık.\n\n## Medine'de Ziyaret Edilecek Yerler\n\n### Mescid-i Nebevi\nHz. Muhammed'in mescidi ve kabri burada bulunmaktadır.\n\n### Ravza-i Mutahhara\nHz. Peygamber'in kabri ile minberi arasındaki alan.\n\n### Cennetü'l-Baki\nBirçok sahabenin medfun olduğu tarihi kabristan.\n\n### Uhud Dağı\nUhud Savaşı'nın yaşandığı tarihi alan.\n\n### Kuba Mescidi\nİslam tarihinin ilk mescidi.\n\nBu mekanları ziyaret ederek manevi yolculuğunuzu zenginleştirebilirsiniz.	https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800&q=80	Erkan Öztürk	Gezi	t	2025-01-05 00:00:00	2025-11-27 04:09:35.188	2025-12-02 03:15:46.339
\.


--
-- Data for Name: Booking; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Booking" (id, name, phone, email, "passengerCount", "tourId", "roomType", "totalPrice", status, notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Certificate; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Certificate" (id, title, number, description, icon, "order", "isActive", "createdAt", "updatedAt") FROM stdin;
seed-cert-1	TÜRSAB Belgesi	A-12345	Türkiye Seyahat Acentaları Birliği üyelik belgesi. Yasal ve güvenilir hizmet garantisi.	Award	1	t	2025-11-27 04:09:35.192	2025-12-02 03:15:46.344
seed-cert-2	Diyanet İşleri Başkanlığı	DİB-2024-HAC-001	Hac ve Umre organizasyonu için Diyanet İşleri Başkanlığı onay belgesi.	Shield	2	t	2025-11-27 04:09:35.194	2025-12-02 03:15:46.346
seed-cert-3	Ticaret Sicil Belgesi	123456-789	İstanbul Ticaret Odası kayıtlı resmi şirket belgesi.	FileText	3	t	2025-11-27 04:09:35.194	2025-12-02 03:15:46.346
seed-cert-4	Vergi Levhası	1234567890	T.C. Gelir İdaresi Başkanlığı vergi mükellefi belgesi.	Building	4	t	2025-11-27 04:09:35.194	2025-12-02 03:15:46.347
\.


--
-- Data for Name: ContactMessage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ContactMessage" (id, name, email, phone, subject, message, status, notes, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: ContactSubject; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."ContactSubject" (id, name, "order", "isActive", "createdAt", "updatedAt") FROM stdin;
cs-1	Umre Turları	1	t	2025-12-02 03:15:46.36	2025-12-02 03:15:46.36
cs-2	Hac Turları	2	t	2025-12-02 03:15:46.361	2025-12-02 03:15:46.361
cs-3	Fiyat Bilgisi	3	t	2025-12-02 03:15:46.362	2025-12-02 03:15:46.362
cs-4	Rezervasyon	4	t	2025-12-02 03:15:46.362	2025-12-02 03:15:46.362
cs-5	Diğer	5	t	2025-12-02 03:15:46.362	2025-12-02 03:15:46.362
\.


--
-- Data for Name: FAQ; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."FAQ" (id, question, answer, "order", "isActive", "createdAt", "updatedAt") FROM stdin;
seed-faq-1	Umre için vize gerekiyor mu?	Evet, Suudi Arabistan'a giriş için vize gerekmektedir. Türk vatandaşları e-vize alabilir veya acente aracılığıyla vize işlemlerini yaptırabilir. Vize işlemleri genellikle tur paketine dahildir.	1	t	2025-11-27 04:09:35.189	2025-12-02 03:15:46.34
seed-faq-2	Umre ne kadar sürer?	Umre turları genellikle 10-15 gün arasında sürer. Kısa programlar 7 gün, uzun programlar ise 20 güne kadar çıkabilir. Süre tercihlerinize ve bütçenize göre değişebilir.	2	t	2025-11-27 04:09:35.19	2025-12-02 03:15:46.341
seed-faq-3	Ödeme nasıl yapılır?	Ödemelerinizi kredi kartı, havale/EFT veya nakit olarak yapabilirsiniz. Taksitli ödeme seçeneklerimiz de mevcuttur. Detaylı bilgi için bizimle iletişime geçebilirsiniz.	3	t	2025-11-27 04:09:35.19	2025-12-02 03:15:46.342
seed-faq-4	Çocuklar için indirim var mı?	2-12 yaş arası çocuklar için %25-50 arası indirim uygulanmaktadır. 2 yaş altı bebekler ücretsiz katılabilir ancak uçakta ayrı koltuk verilmez.	4	t	2025-11-27 04:09:35.19	2025-12-02 03:15:46.342
seed-faq-5	Tur iptal edilirse ne olur?	Şirketimizden kaynaklanan iptallerde ödemenizin tamamı iade edilir. Kendi isteğinizle yapacağınız iptallerde ise iptal tarihine göre kesinti uygulanabilir. Detaylar sözleşmemizde belirtilmiştir.	5	t	2025-11-27 04:09:35.191	2025-12-02 03:15:46.343
seed-faq-6	Otel ve Kabe arası mesafe ne kadardır?	Otel seçiminize göre Kabe'ye olan mesafe değişir. Ekonomik paketlerde 500-1000 metre, standart paketlerde 200-500 metre, VIP paketlerde ise 50-200 metre mesafede oteller tercih edilir.	6	t	2025-11-27 04:09:35.191	2025-12-02 03:15:46.343
seed-faq-7	Yaşlı veya engelli misafirler için özel hizmet var mı?	Evet, yaşlı ve engelli misafirlerimiz için tekerlekli sandalye hizmeti, yakın oteller ve özel refakatçi gibi hizmetler sunulmaktadır. Lütfen rezervasyon sırasında bu ihtiyacınızı belirtin.	7	t	2025-11-27 04:09:35.191	2025-12-02 03:15:46.343
seed-faq-8	Ramazan umresinde oruç tutmak zor mu?	Suudi Arabistan'da Ramazan ayında özel bir atmosfer yaşanır. Otellerde sahur ve iftar hizmetleri sunulur. Sıcak havaya karşı bol su tüketimi ve dinlenme önerilir.	8	t	2025-11-27 04:09:35.192	2025-12-02 03:15:46.344
\.


--
-- Data for Name: FooterLink; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."FooterLink" (id, section, label, href, "order", "isActive", "createdAt", "updatedAt") FROM stdin;
fl-1	quick-links	Hakkımızda	/hakkimizda	1	t	2025-12-02 03:15:46.355	2025-12-02 03:15:46.355
fl-2	quick-links	Belgelerimiz	/belgelerimiz	2	t	2025-12-02 03:15:46.357	2025-12-02 03:15:46.357
fl-3	quick-links	Banka Hesapları	/banka-hesaplari	3	t	2025-12-02 03:15:46.357	2025-12-02 03:15:46.357
fl-4	quick-links	Sıkça Sorulan Sorular	/sss	4	t	2025-12-02 03:15:46.358	2025-12-02 03:15:46.358
fl-5	quick-links	KVKK	/kvkk	5	t	2025-12-02 03:15:46.358	2025-12-02 03:15:46.358
fl-6	quick-links	Blog	/blog	6	t	2025-12-02 03:15:46.358	2025-12-02 03:15:46.358
fl-7	popular-routes	Umre Turları	/umre-turlari	1	t	2025-12-02 03:15:46.358	2025-12-02 03:15:46.358
fl-8	popular-routes	Hac Turları	/hac-turlari	2	t	2025-12-02 03:15:46.359	2025-12-02 03:15:46.359
fl-9	popular-routes	Ramazan Umresi	/ramazan-umresi	3	t	2025-12-02 03:15:46.359	2025-12-02 03:15:46.359
fl-10	popular-routes	Sömestr Umresi	/somestr-umresi	4	t	2025-12-02 03:15:46.36	2025-12-02 03:15:46.36
\.


--
-- Data for Name: HeroSlide; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."HeroSlide" (id, title, subtitle, "imageUrl", "buttonText", "buttonLink", "order", "isActive", "createdAt", "updatedAt") FROM stdin;
seed-slide-0	Manevi Yolculuğunuz En Uygun Fiyatlarla Başlasın	Hac ve Umre turlarında Türkiye'nin en güvenilir karşılaştırma platformu.	https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=80	Turları İncele	/umre-turlari	0	t	2025-11-27 03:07:40.904	2025-12-02 03:15:46.288
seed-slide-1	Ramazan Umresi Fırsatları	Bu Ramazan'da kutsal topraklarda olun. Erken rezervasyon avantajlarını kaçırmayın.	https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1920&q=80	Ramazan Turları	/ramazan-umresi	1	t	2025-11-27 03:07:40.906	2025-12-02 03:15:46.29
seed-slide-2	2025 Hac Kayıtları Başladı	Hayatınızın en önemli yolculuğu için şimdiden yerinizi ayırtın.	https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=1920&q=80	Hac Turları	/hac-turlari	2	t	2025-11-27 03:07:40.907	2025-12-02 03:15:46.291
\.


--
-- Data for Name: Itinerary; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Itinerary" (id, "dayNumber", title, description, "tourId", "createdAt") FROM stdin;
cmio09zig000mrhox7ipjnbnj	1	İstanbul - Cidde Uçuşu	Atatürk Havalimanı'ndan hareket. Cidde Havalimanı'na varış. Mekke'ye transfer ve otele yerleşme.	seed-tour-1	2025-12-02 03:15:46.312
cmio09zih000orhox1rm2fxca	2	Mekke - Umre İbadeti	Sabah namazının ardından umre ibadetinin yapılması. İhrama girme, tavaf ve sa'y.	seed-tour-1	2025-12-02 03:15:46.314
cmio09zii000qrhoxt5q1bshq	3	Mekke - Ziyaretler	Hira Dağı, Sevr Mağarası ve tarihi mekanların ziyareti.	seed-tour-1	2025-12-02 03:15:46.314
cmio09zii000srhoxwf6py5fp	4	Mekke - Serbest Gün	Kabe'de ibadet ve serbest zaman.	seed-tour-1	2025-12-02 03:15:46.315
cmio09zij000urhox7kmbnid1	5	Mekke - Medine Yolculuğu	Öğle namazının ardından Medine'ye hareket. Akşam Medine'ye varış.	seed-tour-1	2025-12-02 03:15:46.315
cmio09zij000wrhoxnf4eysgq	6	Medine - Mescid-i Nebevi	Mescid-i Nebevi ziyareti ve Ravza-i Mutahhara.	seed-tour-1	2025-12-02 03:15:46.316
cmio09zik000yrhoxstagts6z	7	Medine - Ziyaretler	Uhud Dağı, Kuba Mescidi ve yedi mescid ziyaretleri.	seed-tour-1	2025-12-02 03:15:46.316
cmio09zik0010rhoxwww0uha5	8	Medine - Serbest Gün	Mescid-i Nebevi'de ibadet ve serbest zaman.	seed-tour-1	2025-12-02 03:15:46.317
cmio09zik0012rhoxqshruog8	9	Medine - İstanbul Dönüşü	Sabah namazının ardından havalimanına transfer. İstanbul'a dönüş.	seed-tour-1	2025-12-02 03:15:46.317
cmio09zil0014rhoxn4iv3lwn	1	İstanbul - Mekke	Gece uçuşu ile Cidde'ye varış. Mekke'ye transfer.	seed-tour-2	2025-12-02 03:15:46.317
cmio09zil0016rhoxegvioay0	2	Umre İbadeti	Umre ibadetinin ifası. Tavaf ve sa'y.	seed-tour-2	2025-12-02 03:15:46.318
cmio09zil0018rhoxjocoj6bw	3	Ramazan İbadeti	Mekke'de Ramazan ibadeti ve teravih namazları.	seed-tour-2	2025-12-02 03:15:46.318
cmio09zim001arhox35np6jdu	4	Kadir Gecesi Hazırlığı	Kadir Gecesi'ne hazırlık ve ibadet programı.	seed-tour-2	2025-12-02 03:15:46.318
cmio09zim001crhoxy0tdwcs5	5	Dönüş	İstanbul'a dönüş uçuşu.	seed-tour-2	2025-12-02 03:15:46.319
cmio09zin001erhoxpnn2y5r3	1	İstanbul - Cidde	Hac kafilesi ile Cidde'ye hareket.	seed-tour-5	2025-12-02 03:15:46.319
cmio09zin001grhoxvwslliby	2	Mekke'ye Varış	Mekke'ye transfer ve otele yerleşme.	seed-tour-5	2025-12-02 03:15:46.319
cmio09zio001irhoxr54yizjc	3	Umre İbadeti	Kudüm tavafı ve umre ibadeti.	seed-tour-5	2025-12-02 03:15:46.32
cmio09zio001krhoxk6131tcf	4	Terviye Günü	Mina'ya hareket ve geceleme.	seed-tour-5	2025-12-02 03:15:46.321
cmio09zip001mrhoxigu93faz	5	Arefe Günü	Arafat vakfesi. Müzdelife'ye hareket.	seed-tour-5	2025-12-02 03:15:46.321
cmio09ziq001orhoxt99nicpx	6	Bayramın 1. Günü	Şeytan taşlama, kurban kesimi, tıraş ve ziyaret tavafı.	seed-tour-5	2025-12-02 03:15:46.322
cmio09ziq001qrhoxeypgchod	7	Bayramın 2. Günü	Mina'da şeytan taşlama.	seed-tour-5	2025-12-02 03:15:46.323
cmio09zir001srhoxmptrcfog	8	Bayramın 3. Günü	Son şeytan taşlama ve Mekke'ye dönüş.	seed-tour-5	2025-12-02 03:15:46.323
cmio09zir001urhox0conaey1	9	Veda Tavafı	Veda tavafı ve Medine'ye hareket.	seed-tour-5	2025-12-02 03:15:46.324
cmio09zis001wrhoxpudob9h9	10	Dönüş	İstanbul'a dönüş.	seed-tour-5	2025-12-02 03:15:46.324
\.


--
-- Data for Name: LegalPage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."LegalPage" (id, slug, title, content, "isActive", "updatedAt", "createdAt") FROM stdin;
cmio09zju0035rhoxdzq1gnva	kvkk	Kişisel Verilerin Korunması	## 1. Veri Sorumlusu\n\nEn Ucuz Hac Umre Turizm Ltd. Şti. olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu sıfatıyla, kişisel verilerinizi aşağıda açıklanan kapsamda işleyebilecek, kaydedebilecek ve saklayabileceğiz.\n\n## 2. İşlenen Kişisel Veriler\n\nHizmet sunumumuz kapsamında aşağıdaki kişisel verileriniz işlenmektedir:\n\n- Kimlik Bilgileri (Ad, soyad, TC kimlik no, pasaport bilgileri)\n- İletişim Bilgileri (Telefon, e-posta, adres)\n- Sağlık Bilgileri (Aşı durumu, hastalık bilgileri)\n- Finansal Bilgiler (Banka hesap bilgileri, ödeme bilgileri)\n\n## 3. Verilerin İşlenme Amacı\n\nKişisel verileriniz aşağıdaki amaçlarla işlenmektedir:\n\n- Hac ve Umre hizmetlerinin sunulması\n- Vize işlemlerinin gerçekleştirilmesi\n- Rezervasyon ve ödeme işlemlerinin yapılması\n- Yasal yükümlülüklerin yerine getirilmesi\n- İletişim faaliyetlerinin yürütülmesi\n\n## 4. Haklarınız\n\nKVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:\n\n- Kişisel verilerinizin işlenip işlenmediğini öğrenme\n- İşlenmişse buna ilişkin bilgi talep etme\n- İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme\n- Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme\n- Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme\n- Kişisel verilerin silinmesini veya yok edilmesini isteme\n\n## 5. İletişim\n\nKVKK kapsamındaki taleplerinizi, info@enucuzhacumre.com e-posta adresimize veya şirket adresimize yazılı olarak iletebilirsiniz.\n\n---\n\n*Son Güncellenme: 01 Ocak 2025*	t	2025-12-02 03:15:46.363	2025-12-02 03:15:46.363
\.


--
-- Data for Name: MenuItem; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."MenuItem" (id, label, href, "order", "isActive", "openInNewTab", "createdAt", "updatedAt") FROM stdin;
menu-1	Anasayfa	/	1	t	f	2025-12-02 03:15:46.352	2025-12-02 03:15:46.352
menu-2	Hakkımızda	/hakkimizda	2	t	f	2025-12-02 03:15:46.353	2025-12-02 03:15:46.353
menu-3	Hac Turları	/hac-turlari	3	t	f	2025-12-02 03:15:46.354	2025-12-02 03:15:46.354
menu-4	Umre Turları	/umre-turlari	4	t	f	2025-12-02 03:15:46.354	2025-12-02 03:15:46.354
menu-5	Blog	/blog	5	t	f	2025-12-02 03:15:46.354	2025-12-02 03:15:46.354
menu-6	İletişim	/iletisim	6	t	f	2025-12-02 03:15:46.355	2025-12-02 03:15:46.355
\.


--
-- Data for Name: SiteSettings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SiteSettings" (id, "heroTitle", "heroSubtitle", "contactPhone", "whatsappNumber", email, address, "instagramUrl", "facebookUrl", "twitterUrl", "youtubeUrl", "footerText", "tursabNo", "updatedAt", "companyStory", "missionStatement", "satisfactionRate", "totalGuests", "visionStatement", "yearsExperience", "bankWarningText", "newsletterButtonText", "newsletterDescription", "newsletterTitle", "pageDescBanka", "pageDescBelgeler", "pageDescBlog", "pageDescIletisim", "pageDescSss", "paymentMethods", "responseTime", "workingHours") FROM stdin;
site_settings	Manevi Yolculuğunuz En Uygun Fiyatlarla Başlasın	Hac ve Umre turlarında Türkiye'nin en güvenilir karşılaştırma platformu.	+90 544 155 74 49	+90 544 155 74 49	info@enucuzhacumre.com	Fatih Sultan Mehmet Mah. İstanbul Cad. No:123 Fatih/İstanbul	\N	\N	\N	\N	© 2025 En Ucuz Hac Umre. Tüm hakları saklıdır.	A-12345	2025-12-02 03:15:46.35	En Ucuz Hac Umre, 2005 yılından bu yana Hac ve Umre yolculuklarında misafirlerine en iyi hizmeti sunma vizyonuyla kurulmuştur. Sektördeki 20 yıllık tecrübemizle, her yıl binlerce misafirimizi kutsal topraklara uğurlamanın gururunu yaşıyoruz.\n\nMisyonumuz, manevi yolculuğunuzda yanınızda olmak ve bu mübarek ibadeti en konforlu, güvenli ve ekonomik şekilde gerçekleştirmenize yardımcı olmaktır. Türsab belgeli, resmi bir acente olarak tüm işlemlerinizi yasalara uygun şekilde yürütüyoruz.\n\nDeneyimli kadromuz, sektördeki en son gelişmeleri takip ederek size en iyi fiyat ve hizmet garantisi sunmaktadır.	Hac ve Umre ibadetini yerine getirmek isteyen müşterilerimize, en uygun fiyatlarla, en kaliteli hizmeti sunmak. Manevi yolculuklarında yanlarında olmak ve unutulmaz bir deneyim yaşatmak.	98	50000	Türkiye'nin en güvenilir ve tercih edilen Hac-Umre organizasyon şirketi olmak. Sektörde kalite ve müşteri memnuniyeti standartlarını belirleyen öncü bir marka haline gelmek.	20	\N	Abone Ol	Erken rezervasyon fırsatları ve özel indirimlerden ilk siz haberdar olun.	Kampanyalardan Haberdar Olun	Güvenli ödeme için banka hesap bilgilerimiz	Resmi ve yasal tüm belgelerimizle güvenilir hizmet sunuyoruz	Hac ve Umre ile ilgili faydalı bilgiler	Sorularınız için bize ulaşın. Size en iyi hizmeti sunmak için buradayız.	Hac ve Umre ile ilgili merak ettiğiniz soruların cevapları	Visa,Mastercard,Troy	24 saat içinde yanıt	Pzt - Cmt: 09:00 - 18:00
\.


--
-- Data for Name: Tour; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Tour" (id, title, slug, description, price, currency, "startDate", "endDate", quota, "bookedSeats", "meccaHotel", "medinaHotel", "hotelStars", "kaabaDistance", "isFeatured", "isActive", type, "createdAt", "updatedAt") FROM stdin;
seed-tour-1	15 Günlük Ekonomik Umre Turu	15-gunluk-ekonomik-umre-turu	Bütçe dostu fiyatlarla manevi bir yolculuk. Konforlu ulaşım, kaliteli konaklama ve deneyimli rehberlik hizmetimizle unutulmaz bir umre deneyimi yaşayın.	1250.00	USD	2025-03-15 00:00:00	2025-03-30 00:00:00	45	0	Grand Makkah Hotel	Dar Al Taqwa Hotel	3	800	t	t	UMRE	2025-11-27 03:16:36.679	2025-12-02 03:15:46.292
seed-tour-2	Ramazan Umresi - Son 10 Gün	ramazan-umresi-son-10-gun	Ramazan'ın son 10 gününü Mekke ve Medine'de geçirin. Kadir Gecesi'ni Harem'de yaşama fırsatı.	2450.00	USD	2025-03-20 00:00:00	2025-03-30 00:00:00	30	0	Swissotel Makkah	Pullman ZamZam	5	100	t	t	UMRE	2025-11-27 03:16:36.682	2025-12-02 03:15:46.294
seed-tour-3	Premium Kabe Manzaralı Umre	premium-kabe-manzarali-umre	Kabe manzaralı odalarda konaklama ile lüks umre deneyimi. VIP transfer ve özel rehberlik hizmeti dahil.	3200.00	USD	2025-04-05 00:00:00	2025-04-17 00:00:00	20	0	Fairmont Clock Tower	Oberoi Madina	5	50	t	t	UMRE	2025-11-27 03:16:36.683	2025-12-02 03:15:46.295
seed-tour-4	Sömestr Aile Umresi	somestr-aile-umresi	Çocuklarınızla birlikte manevi bir tatil. Aile odaları ve çocuk indirimi ile uygun fiyatlı paket.	1450.00	USD	2025-01-25 00:00:00	2025-02-05 00:00:00	40	0	Hilton Suites Makkah	Millennium Al Aqeeq	4	400	t	t	UMRE	2025-11-27 03:16:36.684	2025-12-02 03:15:46.296
seed-tour-5	Hac 2025 - Standart Paket	hac-2025-standart-paket	2025 Hac mevsimi için standart paket. Tüm hac menasiki, konforlu konaklama ve tecrübeli din görevlisi eşliğinde.	6500.00	USD	2025-06-01 00:00:00	2025-06-20 00:00:00	50	0	Makkah Towers	Anwar Al Madinah Movenpick	4	600	t	t	HAC	2025-11-27 03:16:36.685	2025-12-02 03:15:46.297
seed-tour-6	Hac 2025 - VIP Paket	hac-2025-vip-paket	En konforlu hac deneyimi. Kabe'ye yürüme mesafesinde 5 yıldızlı oteller, özel araç transferleri.	12000.00	USD	2025-06-01 00:00:00	2025-06-20 00:00:00	20	0	Raffles Makkah Palace	The Ritz Carlton Medina	5	80	f	t	HAC	2025-11-27 03:16:36.686	2025-12-02 03:15:46.298
seed-tour-7	10 Günlük Hızlı Umre	10-gunluk-hizli-umre	Yoğun iş temposuna uygun kısa süreli umre paketi. Her şey dahil, sorunsuz organizasyon.	1100.00	USD	2025-02-10 00:00:00	2025-02-20 00:00:00	35	0	Le Meridien Makkah	Crowne Plaza Madinah	4	500	f	t	UMRE	2025-11-27 03:16:36.687	2025-12-02 03:15:46.298
seed-tour-8	Yılbaşı Umresi	yilbasi-umresi	Yeni yıla kutsal topraklarda girin. 31 Aralık'ta Mekke'de olma fırsatı.	1650.00	USD	2025-12-28 00:00:00	2026-01-08 00:00:00	40	0	Conrad Makkah	Sheraton Madinah	5	300	f	t	UMRE	2025-11-27 03:16:36.688	2025-12-02 03:15:46.299
seed-tour-9	Kurban Bayramı Umresi	kurban-bayrami-umresi	Kurban Bayramı'nı Mekke ve Medine'de kutlayın. Bayram namazını Harem'de kılma fırsatı.	1850.00	USD	2025-06-05 00:00:00	2025-06-15 00:00:00	35	0	Hilton Makkah Convention	Dar Al Iman InterContinental	5	200	f	t	UMRE	2025-11-27 03:16:36.688	2025-12-02 03:15:46.3
seed-tour-10	Emekliler İçin Özel Umre	emekliler-icin-ozel-umre	Yaşlı misafirlerimiz için özel hazırlanmış program. Kısa yürüyüş mesafeleri, dinlenme molalı program.	1550.00	USD	2025-05-01 00:00:00	2025-05-15 00:00:00	25	0	Makkah Clock Royal Tower	Madinah Hilton	5	150	f	t	UMRE	2025-11-27 03:16:36.689	2025-12-02 03:15:46.3
\.


--
-- Data for Name: TourExcluded; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TourExcluded" (id, item, "order", "tourId") FROM stdin;
cmio09zj1002srhoxkg6utgjt	Kişisel harcamalar	0	seed-tour-1
cmio09zj2002urhox0353fn34	Ekstra yemekler	1	seed-tour-1
cmio09zj2002wrhoxjq8vkgsg	Vize ücreti (gerekli ise)	2	seed-tour-1
cmio09zj3002yrhoxpbxewqq4	Kişisel harcamalar	0	seed-tour-2
cmio09zj30030rhoxxkhpcc6f	Mini bar kullanımı	1	seed-tour-2
cmio09zj30032rhox6ss2lk2u	Kişisel harcamalar	0	seed-tour-5
cmio09zj40034rhoxzdy7apvb	Ekstra ziyaretler	1	seed-tour-5
\.


--
-- Data for Name: TourImage; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TourImage" (id, url, alt, "order", "tourId", "createdAt") FROM stdin;
cmio09zi80002rhoxedvyal64	https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80	\N	0	seed-tour-1	2025-12-02 03:15:46.304
cmio09zia0004rhox44bp42wh	https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80	\N	0	seed-tour-2	2025-12-02 03:15:46.307
cmio09zib0006rhox1zsd75ld	https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800&q=80	\N	0	seed-tour-3	2025-12-02 03:15:46.308
cmio09zib0008rhoxiqqjg532	https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80	\N	0	seed-tour-4	2025-12-02 03:15:46.308
cmio09zic000arhoxklupqog7	https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80	\N	0	seed-tour-5	2025-12-02 03:15:46.308
cmio09zic000crhoxpmaol2be	https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80	\N	0	seed-tour-6	2025-12-02 03:15:46.309
cmio09zid000erhox8i5laomm	https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=800&q=80	\N	0	seed-tour-7	2025-12-02 03:15:46.309
cmio09zid000grhox86roktlg	https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800&q=80	\N	0	seed-tour-8	2025-12-02 03:15:46.31
cmio09zie000irhoxf01swzm5	https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80	\N	0	seed-tour-9	2025-12-02 03:15:46.31
cmio09zie000krhoxj5zt5cxp	https://images.unsplash.com/photo-1564769625905-50e93615e769?w=800&q=80	\N	0	seed-tour-10	2025-12-02 03:15:46.31
\.


--
-- Data for Name: TourIncluded; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TourIncluded" (id, item, "order", "tourId") FROM stdin;
cmio09ziv001yrhoxw5f8q13i	Gidiş-dönüş uçak bileti	0	seed-tour-1
cmio09ziw0020rhoxtha94pkc	Mekke ve Medine otel konaklaması	1	seed-tour-1
cmio09ziw0022rhoxpt53kt5x	Tüm transferler (klimalı araçlar)	2	seed-tour-1
cmio09zix0024rhoxqne3sqb6	Ziyaret programı	3	seed-tour-1
cmio09zix0026rhoxtko6kqme	Tecrübeli din görevlisi	4	seed-tour-1
cmio09zix0028rhox45ul4rvy	Seyahat sağlık sigortası	5	seed-tour-1
cmio09ziy002arhoxxnlly9i9	Gidiş-dönüş uçak bileti	0	seed-tour-2
cmio09ziy002crhoxroow796a	5 yıldızlı otel konaklaması	1	seed-tour-2
cmio09ziz002erhoxwabsqx7j	Açık büfe sahur ve iftar	2	seed-tour-2
cmio09ziz002grhox41579ijo	VIP transfer hizmeti	3	seed-tour-2
cmio09ziz002irhoxot50s257	Gidiş-dönüş uçak bileti	0	seed-tour-5
cmio09zj0002krhox86xqpi4b	Mekke, Mina, Arafat konaklaması	1	seed-tour-5
cmio09zj0002mrhox4tdq6zqm	Kurban kesimi	2	seed-tour-5
cmio09zj0002orhoxjo02v7c4	Tüm hac menasiki organizasyonu	3	seed-tour-5
cmio09zj1002qrhoxaee16dpp	Din görevlisi refakati	4	seed-tour-5
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."User" (id, email, password, name, role, "isActive", "lastLogin", "createdAt", "updatedAt") FROM stdin;
cmigth43h0000rhrozogtxiwh	erozturk0381@gmail.com	$2b$12$2Crael/ck9aCI9N6Uaw/PeqrOpA5pj3X41jzB/bTGpdpfTURKKSeC	Erkan Öztürk	SUPER_ADMIN	t	2025-12-02 02:29:48.408	2025-11-27 02:30:58.301	2025-12-02 03:15:46.284
\.


--
-- Name: BankAccount BankAccount_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BankAccount"
    ADD CONSTRAINT "BankAccount_pkey" PRIMARY KEY (id);


--
-- Name: BlogPost BlogPost_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."BlogPost"
    ADD CONSTRAINT "BlogPost_pkey" PRIMARY KEY (id);


--
-- Name: Booking Booking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_pkey" PRIMARY KEY (id);


--
-- Name: Certificate Certificate_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Certificate"
    ADD CONSTRAINT "Certificate_pkey" PRIMARY KEY (id);


--
-- Name: ContactMessage ContactMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContactMessage"
    ADD CONSTRAINT "ContactMessage_pkey" PRIMARY KEY (id);


--
-- Name: ContactSubject ContactSubject_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."ContactSubject"
    ADD CONSTRAINT "ContactSubject_pkey" PRIMARY KEY (id);


--
-- Name: FAQ FAQ_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FAQ"
    ADD CONSTRAINT "FAQ_pkey" PRIMARY KEY (id);


--
-- Name: FooterLink FooterLink_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."FooterLink"
    ADD CONSTRAINT "FooterLink_pkey" PRIMARY KEY (id);


--
-- Name: HeroSlide HeroSlide_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HeroSlide"
    ADD CONSTRAINT "HeroSlide_pkey" PRIMARY KEY (id);


--
-- Name: Itinerary Itinerary_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Itinerary"
    ADD CONSTRAINT "Itinerary_pkey" PRIMARY KEY (id);


--
-- Name: LegalPage LegalPage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."LegalPage"
    ADD CONSTRAINT "LegalPage_pkey" PRIMARY KEY (id);


--
-- Name: MenuItem MenuItem_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."MenuItem"
    ADD CONSTRAINT "MenuItem_pkey" PRIMARY KEY (id);


--
-- Name: SiteSettings SiteSettings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SiteSettings"
    ADD CONSTRAINT "SiteSettings_pkey" PRIMARY KEY (id);


--
-- Name: TourExcluded TourExcluded_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TourExcluded"
    ADD CONSTRAINT "TourExcluded_pkey" PRIMARY KEY (id);


--
-- Name: TourImage TourImage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TourImage"
    ADD CONSTRAINT "TourImage_pkey" PRIMARY KEY (id);


--
-- Name: TourIncluded TourIncluded_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TourIncluded"
    ADD CONSTRAINT "TourIncluded_pkey" PRIMARY KEY (id);


--
-- Name: Tour Tour_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tour"
    ADD CONSTRAINT "Tour_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: BankAccount_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BankAccount_order_idx" ON public."BankAccount" USING btree ("order");


--
-- Name: BlogPost_category_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BlogPost_category_idx" ON public."BlogPost" USING btree (category);


--
-- Name: BlogPost_isPublished_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BlogPost_isPublished_idx" ON public."BlogPost" USING btree ("isPublished");


--
-- Name: BlogPost_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "BlogPost_slug_idx" ON public."BlogPost" USING btree (slug);


--
-- Name: BlogPost_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "BlogPost_slug_key" ON public."BlogPost" USING btree (slug);


--
-- Name: Booking_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Booking_createdAt_idx" ON public."Booking" USING btree ("createdAt");


--
-- Name: Booking_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Booking_status_idx" ON public."Booking" USING btree (status);


--
-- Name: Booking_tourId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Booking_tourId_idx" ON public."Booking" USING btree ("tourId");


--
-- Name: Certificate_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Certificate_order_idx" ON public."Certificate" USING btree ("order");


--
-- Name: ContactMessage_createdAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ContactMessage_createdAt_idx" ON public."ContactMessage" USING btree ("createdAt");


--
-- Name: ContactMessage_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ContactMessage_status_idx" ON public."ContactMessage" USING btree (status);


--
-- Name: ContactSubject_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "ContactSubject_order_idx" ON public."ContactSubject" USING btree ("order");


--
-- Name: FAQ_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FAQ_isActive_idx" ON public."FAQ" USING btree ("isActive");


--
-- Name: FAQ_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FAQ_order_idx" ON public."FAQ" USING btree ("order");


--
-- Name: FooterLink_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FooterLink_order_idx" ON public."FooterLink" USING btree ("order");


--
-- Name: FooterLink_section_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "FooterLink_section_idx" ON public."FooterLink" USING btree (section);


--
-- Name: HeroSlide_isActive_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "HeroSlide_isActive_idx" ON public."HeroSlide" USING btree ("isActive");


--
-- Name: HeroSlide_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "HeroSlide_order_idx" ON public."HeroSlide" USING btree ("order");


--
-- Name: Itinerary_dayNumber_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Itinerary_dayNumber_idx" ON public."Itinerary" USING btree ("dayNumber");


--
-- Name: Itinerary_tourId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Itinerary_tourId_idx" ON public."Itinerary" USING btree ("tourId");


--
-- Name: LegalPage_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "LegalPage_slug_idx" ON public."LegalPage" USING btree (slug);


--
-- Name: LegalPage_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "LegalPage_slug_key" ON public."LegalPage" USING btree (slug);


--
-- Name: MenuItem_order_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "MenuItem_order_idx" ON public."MenuItem" USING btree ("order");


--
-- Name: TourExcluded_tourId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TourExcluded_tourId_idx" ON public."TourExcluded" USING btree ("tourId");


--
-- Name: TourImage_tourId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TourImage_tourId_idx" ON public."TourImage" USING btree ("tourId");


--
-- Name: TourIncluded_tourId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TourIncluded_tourId_idx" ON public."TourIncluded" USING btree ("tourId");


--
-- Name: Tour_isFeatured_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Tour_isFeatured_idx" ON public."Tour" USING btree ("isFeatured");


--
-- Name: Tour_slug_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Tour_slug_idx" ON public."Tour" USING btree (slug);


--
-- Name: Tour_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "Tour_slug_key" ON public."Tour" USING btree (slug);


--
-- Name: Tour_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Tour_type_idx" ON public."Tour" USING btree (type);


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "User_role_idx" ON public."User" USING btree (role);


--
-- Name: Booking Booking_tourId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Booking"
    ADD CONSTRAINT "Booking_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES public."Tour"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Itinerary Itinerary_tourId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Itinerary"
    ADD CONSTRAINT "Itinerary_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES public."Tour"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TourExcluded TourExcluded_tourId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TourExcluded"
    ADD CONSTRAINT "TourExcluded_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES public."Tour"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TourImage TourImage_tourId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TourImage"
    ADD CONSTRAINT "TourImage_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES public."Tour"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TourIncluded TourIncluded_tourId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TourIncluded"
    ADD CONSTRAINT "TourIncluded_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES public."Tour"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

