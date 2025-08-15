import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TermsAndConditions() {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.pageYOffset > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const goHome = () => {
        navigate('/');
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const styles = {
        body: {
            fontFamily: "'Georgia', 'Times New Roman', serif",
            lineHeight: 1.6,
            color: '#333',
            backgroundColor: '#fafafa',
            margin: 0,
            padding: 0,
        },
        header: {
            background: 'linear-gradient(135deg, #DAA520, #F5DEB3)',
            color: '#8B4513',
            padding: '2rem 0',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            position: 'relative',
        },
        headerH1: {
            fontSize: '2.5rem',
            marginBottom: '0.5rem',
            fontWeight: 300,
        },
        headerP: {
            fontSize: '1.1rem',
            opacity: 0.9,
        },
        container: {
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '0 20px',
        },
        content: {
            background: 'white',
            margin: '-50px auto 2rem',
            padding: '3rem',
            borderRadius: '15px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            position: 'relative',
            zIndex: 1,
        },
        lastUpdated: {
            background: '#FFF8DC',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            borderLeft: '4px solid #DAA520',
        },
        tableOfContents: {
            background: '#f8f9fa',
            padding: '2rem',
            borderRadius: '10px',
            marginBottom: '2rem',
            border: '1px solid #e9ecef',
        },
        tocTitle: {
            color: '#B8860B',
            marginBottom: '1rem',
        },
        tocList: {
            listStyle: 'none',
            padding: 0,
        },
        tocItem: {
            marginBottom: '0.5rem',
        },
        tocLink: {
            color: '#495057',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'color 0.3s ease',
        },
        section: {
            marginBottom: '3rem',
        },
        sectionH2: {
            color: '#B8860B',
            fontSize: '1.8rem',
            marginBottom: '1rem',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid #DAA520',
        },
        sectionH3: {
            color: '#495057',
            fontSize: '1.3rem',
            marginTop: '1.5rem',
            marginBottom: '0.8rem',
        },
        sectionP: {
            marginBottom: '1rem',
            textAlign: 'justify',
        },
        sectionUl: {
            marginBottom: '1rem',
            paddingLeft: '2rem',
        },
        sectionLi: {
            marginBottom: '0.5rem',
        },
        highlightBox: {
            background: 'linear-gradient(135deg, #FFF8DC, #F5DEB3)',
            padding: '1.5rem',
            borderRadius: '10px',
            borderLeft: '4px solid #DAA520',
            margin: '1.5rem 0',
        },
        contactInfo: {
            background: '#f8f9fa',
            padding: '2rem',
            borderRadius: '10px',
            textAlign: 'center',
            marginTop: '2rem',
        },
        contactTitle: {
            color: '#B8860B',
            marginBottom: '1rem',
        },
        socialLinks: {
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1rem',
            flexWrap: 'wrap',
        },
        socialLink: {
            color: '#DAA520',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            background: 'white',
            borderRadius: '25px',
            transition: 'all 0.3s ease',
        },
        footer: {
            textAlign: 'center',
            padding: '2rem',
            color: '#6c757d',
            borderTop: '1px solid #e9ecef',
            marginTop: '2rem',
        },
        scrollTop: {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: '#DAA520',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        backHomeBtn: {
            position: 'fixed',
            top: '20px',
            left: '20px',
            background: 'linear-gradient(135deg, #DAA520, #F5DEB3)',
            color: '#8B4513',
            border: '2px solid #B8860B',
            borderRadius: '25px',
            padding: '12px 20px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            zIndex: 9999,
            boxShadow: '0 4px 15px rgba(218, 165, 32, 0.3)',
        }
    };

    return (
        <div style={styles.body}>
            <div style={styles.header}>
                <div style={styles.container}>
                    <h1 style={styles.headerH1}>Glowup Couture</h1>
                    <p style={styles.headerP}>Terms & Conditions</p>
                </div>
            </div>

            <div style={styles.container}>
                <div style={styles.content}>
                    <div style={styles.lastUpdated}>
                        <strong>Last Updated:</strong> August 2025
                    </div>

                    <p style={{...styles.sectionP, fontSize: '1.1rem', marginBottom: '2rem'}}>
                        Welcome to Glowup Couture! We're so glad you're here. Before you start shopping, please take a moment to read our Terms & Conditions and our Privacy Policy. By using this website, you agree to these terms, whether or not you create an account with us.
                    </p>

                    <div style={styles.tableOfContents}>
                        <h3 style={styles.tocTitle}>Table of Contents</h3>
                        <ul style={styles.tocList}>
                            {['about-us', 'about-you', 'service-availability', 'making-orders', 'prices', 
                              'delivery', 'returns', 'fair-use', 'promo-codes', 'gift-vouchers',
                              'your-information', 'intellectual-property', 'customer-care', 'user-content']
                              .map((section, index) => {
                                const labels = [
                                    'About Us', 'About You', 'Service Availability and Order Placement',
                                    'Making Orders Through the Website', 'Prices and Product Descriptions',
                                    'Delivery', 'Our Return, Refund, and Exchange Policy', 'Fair Use Policy',
                                    'Promo Codes', 'Gift Vouchers', 'Your Information', 
                                    'Intellectual Property Rights', 'Customer Care and Service',
                                    'User-Generated Content'
                                ];
                                return (
                                    <li key={section} style={styles.tocItem}>
                                        <span 
                                            style={styles.tocLink} 
                                            onClick={() => scrollToSection(section)}
                                            onMouseEnter={(e) => e.target.style.color = '#DAA520'} 
                                            onMouseLeave={(e) => e.target.style.color = '#495057'}
                                        >
                                            {labels[index]}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div style={styles.section} id="about-us">
                        <h2 style={styles.sectionH2}>About Us</h2>
                        <p style={styles.sectionP}><strong>www.glowupcouture.com</strong> is a site operated by Glowup Couture Limited. We are registered in Nairobi, Kenya, with our offices located at [Insert Glowup Couture Address Here]. You can email us at <strong>support@glowupcouture.com</strong>.</p>
                    </div>

                    <div style={styles.section} id="about-you">
                        <h2 style={styles.sectionH2}>About You</h2>
                        <p style={styles.sectionP}>To shop with us, you need to:</p>
                        <ul style={styles.sectionUl}>
                            <li style={styles.sectionLi}>Be at least 18 years old.</li>
                            <li style={styles.sectionLi}>Have a valid credit or debit card that we accept.</li>
                            <li style={styles.sectionLi}>Be authorized to use that credit or debit card (e.g., it is in your name or you have permission to use it).</li>
                            <li style={styles.sectionLi}>Have a registered personal M-Pesa Account. If not, you must have permission to use the M-Pesa account you're paying with.</li>
                        </ul>
                    </div>

                    <div style={styles.section} id="service-availability">
                        <h2 style={styles.sectionH2}>Service Availability and Order Placement</h2>
                        <p style={styles.sectionP}>Once you place an order, you will receive an email confirming its receipt. Our online sales team will then conduct a standard pre-authorization check. If you pay by card, we'll quickly confirm the card and the amount available. Your order is accepted once payment is approved and debited. For M-Pesa payments, we'll verify the amount and the payment code, which will also be included in your email receipt.</p>
                    </div>

                    <div style={styles.section} id="making-orders">
                        <h2 style={styles.sectionH2}>Making Orders Through the Website</h2>
                        <div style={styles.highlightBox}>
                            <p><strong>Important:</strong> If you're not happy with your order, you can cancel it within 24 hours. You cannot change an order once it's placed.</p>
                        </div>
                        <p style={styles.sectionP}>To get a different item, you will need to cancel your original order, return the items (if already delivered), and place a new order.</p>
                        <p style={styles.sectionP}>All orders are subject to product availability and price confirmation. We will contact you immediately if there's an issue with your order. Please ensure all the details you provide us are true and accurate when placing an order.</p>
                    </div>

                    <div style={styles.section} id="prices">
                        <h2 style={styles.sectionH2}>Prices and Product Descriptions</h2>
                        <p style={styles.sectionP}>We strive for accuracy, but sometimes errors in pricing, product descriptions, or promotions may occur. If we find an error with an item you've ordered, our customer care team will contact you as soon as possible, giving you the option to reconfirm the order at the correct price or cancel it. If the mistake is discovered after you've made a purchase, we will inform you of the error and offer you a credit note or gift voucher for the excess amount.</p>
                    </div>

                    <div style={styles.section} id="delivery">
                        <h2 style={styles.sectionH2}>Delivery</h2>
                        <p style={styles.sectionP}>When you place an order, you can choose from various delivery options, including estimated delivery times and dates based on your location. This includes picking up from our stores, home delivery, or work delivery. While our team works hard to deliver on time, delays can happen. We will do our best to keep you updated on your parcel's location by sending emails on the status of your order so you can track its progress. Please visit our delivery information page for more details.</p>
                    </div>

                    <div style={styles.section} id="returns">
                        <h2 style={styles.sectionH2}>Our Return, Refund, and Exchange Policy</h2>
                        <p style={styles.sectionP}>We understand that sometimes an item just doesn't work out. As long as the item is in its original condition, we accept returns, subject to the following rules:</p>
                        
                        <h3 style={styles.sectionH3}>Return Conditions</h3>
                        <ul style={styles.sectionUl}>
                            <li style={styles.sectionLi}><strong>Merchandise Condition:</strong> Items must be in their original condition, unworn, and unwashed.</li>
                            <li style={styles.sectionLi}><strong>Return Period:</strong> You have up to <strong>7 days</strong> from the date of delivery to initiate a return.</li>
                            <li style={styles.sectionLi}><strong>Refund Options:</strong> You can choose to receive your refund via M-Pesa or as a Glowup Couture Gift Card.</li>
                            <li style={styles.sectionLi}><strong>Refund Service Level Agreement (SLA):</strong> We commit to processing your refund within 2-3 days from the time the item is returned to our warehouse.</li>
                        </ul>

                        <div style={styles.highlightBox}>
                            <p><strong>Important:</strong> M-Pesa refunds are not applicable to discounted items. Items purchased during promotional periods, such as Black November, are only eligible for exchanges or gift card refunds.</p>
                        </div>

                        <h3 style={styles.sectionH3}>Exchange Procedure</h3>
                        <ol style={styles.sectionUl}>
                            <li style={styles.sectionLi}>Items must meet our return criteria to be eligible for an exchange.</li>
                            <li style={styles.sectionLi}>Once the item is returned to us, it will be sent to the Glowup Couture warehouse before the new exchange item is dispatched.</li>
                            <li style={styles.sectionLi}><strong>Exchange SLA:</strong> We aim to complete exchanges within 2-3 days for Nairobi residents and 3-7 days for those in other areas from the time you hand over the item.</li>
                        </ol>

                        <h3 style={styles.sectionH3}>What is NOT eligible for Return</h3>
                        <p style={styles.sectionP}>We reserve the right to refuse a return if it does not meet the following criteria:</p>
                        <ul style={styles.sectionUl}>
                            <li style={styles.sectionLi}>Items from the <strong>Skincare, Make-up, Swimwear, Fragrances, and Underwear</strong> categories.</li>
                            <li style={styles.sectionLi}>Orders that are past the 7-day return period.</li>
                            <li style={styles.sectionLi}>Items that are believed to have been washed.</li>
                            <li style={styles.sectionLi}>Orders without a Glowup Couture invoice.</li>
                            <li style={styles.sectionLi}>Items that do not meet hygiene standards due to foreign stains, sweat, or dirt.</li>
                        </ul>

                        <p style={styles.sectionP}><strong>Note:</strong> Glowup Couture will not use payments from another order for the refund process. The return must be fully completed before we can initiate a refund.</p>
                    </div>

                    <div style={styles.section} id="fair-use">
                        <h2 style={styles.sectionH2}>Fair Use Policy</h2>
                        <p style={styles.sectionP}>If we suspect someone is repeatedly wearing and then returning purchases, or returning items excessively, we may stop accepting your returns. If you believe we've made a mistake, please contact Customer Care, and we'll be happy to discuss it with you.</p>
                    </div>

                    <div style={styles.section} id="promo-codes">
                        <h2 style={styles.sectionH2}>Promo Codes</h2>
                        <p style={styles.sectionP}>We may offer promotions that include discounts or perks. Remember to enter the code during checkout for it to apply.</p>
                        <p style={styles.sectionP}>A few things to keep in mind about promo codes:</p>
                        <ul style={styles.sectionUl}>
                            <li style={styles.sectionLi}>Each promo code has its own terms, which will be communicated when the code is issued. This includes usage dates, applicable products, and whether it's for single or multiple uses.</li>
                            <li style={styles.sectionLi}>If you receive a personal code, please keep it private. If we find you've shared it and it's being used by multiple people, we may cancel the promo code and suspend your account.</li>
                        </ul>
                    </div>

                    <div style={styles.section} id="gift-vouchers">
                        <h2 style={styles.sectionH2}>Gift Vouchers</h2>
                        <p style={styles.sectionP}>If you're gifting a voucher or are the lucky recipient of one, visit our gift voucher page for details on how and when they can be used.</p>
                        <ul style={styles.sectionUl}>
                            <li style={styles.sectionLi}>Vouchers are valid for <strong>6 months</strong> from the date of purchase. Our customer care team will remind you to use it before it expires.</li>
                            <li style={styles.sectionLi}>Make sure you get the recipient's email address correct! If you get it wrong and the voucher is used by someone else, we are unable to assist.</li>
                            <li style={styles.sectionLi}>All gift vouchers are non-refundable and cannot be exchanged for cash.</li>
                        </ul>
                    </div>

                    <div style={styles.section} id="your-information">
                        <h2 style={styles.sectionH2}>Your Information</h2>
                        <p style={styles.sectionP}>Our Privacy Policy outlines how we use your information. Please visit this page to read more. If your details change, please update your account so we can continue to provide you with the best service.</p>
                    </div>

                    <div style={styles.section} id="intellectual-property">
                        <h2 style={styles.sectionH2}>Intellectual Property Rights</h2>
                        <p style={styles.sectionP}>Glowup Couture owns the intellectual property used on its website and digital platforms. These rights are protected and reserved. As a client, you may store, print, and display our content for personal use only. The use of our content for commercial purposes is not allowed without our permission. Using our logo for any kind of trading is also prohibited.</p>
                    </div>

                    <div style={styles.section} id="customer-care">
                        <h2 style={styles.sectionH2}>Customer Care and Service</h2>
                        <p style={styles.sectionP}>Feel free to get in touch with us for any reason. You can reach us from Monday to Friday, between 8:00 AM and 5:00 PM:</p>
                        
                        <div style={styles.contactInfo}>
                            <h3 style={styles.contactTitle}>Contact Information</h3>
                            <p><strong>Email:</strong> support@glowupcouture.com</p>
                            <p><strong>Phone:</strong> +254 [Insert Phone Number]</p>
                            
                            <div style={styles.socialLinks}>
                                <a href="#" target="_blank" rel="noopener noreferrer" style={styles.socialLink} onMouseEnter={(e) => {e.target.style.background = '#DAA520'; e.target.style.color = 'white';}} onMouseLeave={(e) => {e.target.style.background = 'white'; e.target.style.color = '#DAA520';}}>@GlowupCouture (Twitter)</a>
                                <a href="#" target="_blank" rel="noopener noreferrer" style={styles.socialLink} onMouseEnter={(e) => {e.target.style.background = '#DAA520'; e.target.style.color = 'white';}} onMouseLeave={(e) => {e.target.style.background = 'white'; e.target.style.color = '#DAA520';}}>@GlowupCouture (Facebook)</a>
                                <a href="#" target="_blank" rel="noopener noreferrer" style={styles.socialLink} onMouseEnter={(e) => {e.target.style.background = '#DAA520'; e.target.style.color = 'white';}} onMouseLeave={(e) => {e.target.style.background = 'white'; e.target.style.color = '#DAA520';}}>@GlowupCouture (Instagram)</a>
                            </div>
                        </div>
                    </div>

                    <div style={styles.section} id="user-content">
                        <h2 style={styles.sectionH2}>User-Generated Content</h2>
                        <p style={styles.sectionP}>We love to showcase our clients' style! When you tag us in your content, you give us permission to share it on our social media pages and website. By using the hashtags <strong>#GlowupCouture</strong>, <strong>#GlowupStyle</strong>, and <strong>#WearTheGlow</strong>, you agree to the following:</p>
                        
                        <ul style={styles.sectionUl}>
                            <li style={styles.sectionLi}>We can use your handle and content on glowupcouture.com and our social media platforms (including Instagram, Facebook, and Twitter).</li>
                            <li style={styles.sectionLi}>We can edit, crop, adapt, or modify the content.</li>
                        </ul>

                        <p style={styles.sectionP}>You promise that you:</p>
                        <ul style={styles.sectionUl}>
                            <li style={styles.sectionLi}>Have permission from everyone in the content to share it with us.</li>
                            <li style={styles.sectionLi}>Have the right to grant Glowup Couture these permissions.</li>
                            <li style={styles.sectionLi}>Are at least 18 years old.</li>
                        </ul>

                        <div style={styles.highlightBox}>
                            <p>If you are uncomfortable with us sharing your content, just let us know, and we will remove it. Please be aware that other social media users can save and share the content once it's posted. If this is a concern, please do not give us consent to use your content.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.footer}>
                <div style={styles.container}>
                    <p>&copy; 2025 Glowup Couture Limited. All rights reserved.</p>
                    <p>Nairobi, Kenya</p>
                </div>
            </div>

            {showScrollTop && (
                <button 
                    style={styles.scrollTop}
                    onClick={scrollToTop}
                    onMouseEnter={(e) => e.target.style.background = '#B8860B'}
                    onMouseLeave={(e) => e.target.style.background = '#DAA520'}
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
            )}
        </div>
    );
}