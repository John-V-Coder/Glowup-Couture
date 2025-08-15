import { useState, useEffect } from 'react';


export default function ReturnRefundExchangePolicy() {
    const [showScrollTop, setShowScrollTop] = useState(false);

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
        // You can implement navigation logic here based on your routing setup
        window.history.back(); // Simple back navigation
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
        welcomeText: {
            fontSize: '1.1rem',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #FFF8DC, #F5DEB3)',
            padding: '1.5rem',
            borderRadius: '10px',
            borderLeft: '4px solid #DAA520',
            fontStyle: 'italic',
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
        warningBox: {
            background: 'linear-gradient(135deg, #FFF2E0, #FFE4B3)',
            padding: '1.5rem',
            borderRadius: '10px',
            borderLeft: '4px solid #FF8C00',
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
            display: showScrollTop ? 'block' : 'none',
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
            display: 'block',
            visibility: 'visible',
        },
    };

    return (
        <>

            <div style={styles.body}>
                <div style={styles.header}>
                    <div style={styles.container}>
                        <h1 style={styles.headerH1}>Glowup Couture</h1>
                        <p style={styles.headerP}>Return, Refund & Exchange Policy</p>
                    </div>
                </div>

                <div style={styles.container}>
                    <div style={styles.content}>
                        <div style={styles.lastUpdated}>
                            <strong>Last Updated:</strong> August 2025 | <strong>Applicable:</strong> Kenya Only
                        </div>

                        <div style={styles.welcomeText}>
                            Welcome to Glowup Couture! We value your shopping experience and want to make it as smooth as possible. Since we only operate within Kenya, here is our simplified Returns and Exchanges Policy, designed specifically for you.
                        </div>

                        <div style={styles.tableOfContents}>
                            <h3 style={styles.tocTitle}>Quick Navigation</h3>
                            <ul style={styles.tocList}>
                                <li style={styles.tocItem}><span style={styles.tocLink} onClick={() => scrollToSection('eligibility')} onMouseEnter={(e) => e.target.style.color = '#DAA520'} onMouseLeave={(e) => e.target.style.color = '#495057'}>1. Eligibility</span></li>
                                <li style={styles.tocItem}><span style={styles.tocLink} onClick={() => scrollToSection('refund-options')} onMouseEnter={(e) => e.target.style.color = '#DAA520'} onMouseLeave={(e) => e.target.style.color = '#495057'}>2. Refund and Exchange Options</span></li>
                                <li style={styles.tocItem}><span style={styles.tocLink} onClick={() => scrollToSection('return-process')} onMouseEnter={(e) => e.target.style.color = '#DAA520'} onMouseLeave={(e) => e.target.style.color = '#495057'}>3. Return Process</span></li>
                                <li style={styles.tocItem}><span style={styles.tocLink} onClick={() => scrollToSection('shipping-costs')} onMouseEnter={(e) => e.target.style.color = '#DAA520'} onMouseLeave={(e) => e.target.style.color = '#495057'}>4. Return Shipping Costs</span></li>
                                <li style={styles.tocItem}><span style={styles.tocLink} onClick={() => scrollToSection('refund-process')} onMouseEnter={(e) => e.target.style.color = '#DAA520'} onMouseLeave={(e) => e.target.style.color = '#495057'}>5. Refund Process</span></li>
                                <li style={styles.tocItem}><span style={styles.tocLink} onClick={() => scrollToSection('ineligible-items')} onMouseEnter={(e) => e.target.style.color = '#DAA520'} onMouseLeave={(e) => e.target.style.color = '#495057'}>6. Items Not Eligible for Return</span></li>
                                <li style={styles.tocItem}><span style={styles.tocLink} onClick={() => scrollToSection('contact-us')} onMouseEnter={(e) => e.target.style.color = '#DAA520'} onMouseLeave={(e) => e.target.style.color = '#495057'}>7. Contact Us</span></li>
                            </ul>
                        </div>

                        <div style={styles.section} id="eligibility">
                            <h2 style={styles.sectionH2}>1. Eligibility</h2>
                            <p style={styles.sectionP}>You may return or exchange an item within <strong>7 days</strong> of delivery, provided that the items meet the following criteria:</p>
                            <ul style={styles.sectionUl}>
                                <li style={styles.sectionLi}>Items must be in their original condition, unworn, and with all tags attached.</li>
                                <li style={styles.sectionLi}>Items must not have been washed.</li>
                                <li style={styles.sectionLi}>Items must meet hygiene standards, free from sweat, dirt, or stains.</li>
                                <li style={styles.sectionLi}>The item must be accompanied by the original Glowup Couture invoice.</li>
                            </ul>
                        </div>

                        <div style={styles.section} id="refund-options">
                            <h2 style={styles.sectionH2}>2. Refund and Exchange Options</h2>
                            <p style={styles.sectionP}>You can choose between a refund via <strong>M-Pesa</strong> or a <strong>Glowup Couture Gift Card</strong>.</p>
                            
                            <div style={styles.highlightBox}>
                                <p><strong>Important:</strong> Items bought on <strong>sale</strong> are only eligible for an <strong>exchange</strong> or <strong>gift card refund</strong>; no M-Pesa refunds will be provided for discounted items.</p>
                            </div>
                        </div>

                        <div style={styles.section} id="return-process">
                            <h2 style={styles.sectionH2}>3. Return Process</h2>
                            <p style={styles.sectionP}>To initiate a return, please contact our customer support team at <strong>[Your Phone Number Here]</strong>. Our team will guide you through the process. Securely pack your item, including all original packaging and the invoice, and drop it off at the designated return location provided by our support team.</p>
                            
                            <div style={styles.warningBox}>
                                <p><strong>Please note:</strong> No returns will be accepted without first being initiated by our Customer Support team.</p>
                            </div>
                        </div>

                        <div style={styles.section} id="shipping-costs">
                            <h2 style={styles.sectionH2}>4. Return Shipping Costs</h2>
                            <h3 style={styles.sectionH3}>Within Nairobi</h3>
                            <p style={styles.sectionP}>Customers must contact us to initiate a return and drop off the item at the nearest designated drop-off point. Alternative return arrangements may be available for an additional fee.</p>
                            
                            <h3 style={styles.sectionH3}>Outside Nairobi</h3>
                            <p style={styles.sectionP}>Customers are responsible for the return shipping costs via a courier service agreed upon with our customer support team.</p>
                        </div>

                        <div style={styles.section} id="refund-process">
                            <h2 style={styles.sectionH2}>5. Refund Process</h2>
                            <div style={styles.highlightBox}>
                                <p>Once we receive the returned item, your refund will be processed within <strong>2-3 business days</strong>.</p>
                            </div>
                        </div>

                        <div style={styles.section} id="ineligible-items">
                            <h2 style={styles.sectionH2}>6. Items Not Eligible for Return</h2>
                            <p style={styles.sectionP}>For hygiene reasons, the following items are not eligible for return or exchange:</p>
                            <ul style={styles.sectionUl}>
                                <li style={styles.sectionLi}>Skincare</li>
                                <li style={styles.sectionLi}>Make-up</li>
                                <li style={styles.sectionLi}>Swimwear</li>
                                <li style={styles.sectionLi}>Fragrances</li>
                                <li style={styles.sectionLi}>Underwear</li>
                            </ul>
                        </div>

                        <div style={styles.section} id="contact-us">
                            <h2 style={styles.sectionH2}>7. Contact Us</h2>
                            <p style={styles.sectionP}>For any questions or concerns about our Returns and Exchanges Policy, please feel free to contact our customer support team:</p>
                            
                            <div style={styles.contactInfo}>
                                <h3 style={styles.contactTitle}>Customer Support</h3>
                                <p><strong>Email:</strong> support@glowupcouture.com</p>
                                <p><strong>Phone:</strong> [Your Phone Number Here]</p>
                                <p><strong>Hours:</strong> Monday to Friday, 8:00 AM - 5:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.footer}>
                    <div style={styles.container}>
                        <p>&copy; 2025 Glowup Couture Limited. All rights reserved.</p>
                        <p>This policy applies to Kenya operations only</p>
                    </div>
                </div>

                {showScrollTop && (
                    <button 
                        style={styles.scrollTop}
                        onClick={scrollToTop}
                        onMouseEnter={(e) => e.target.style.background = '#B8860B'}
                        onMouseLeave={(e) => e.target.style.background = '#DAA520'}
                    >
                        ↑
                    </button>
                )}
            </div>
        </>
    );
}