'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MotionWrapper from '@/components/MotionWrapper';
import ContactForm from '@/components/contact/ContactForm';
import ContactInfo from '@/components/contact/ContactInfo';
import ContactMap from '@/components/contact/ContactMap';

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleSubmit = async (formData: {
        name: string;
        email: string;
        phone: string;
        subject: string;
        message: string;
    }) => {
        try {
            setIsSubmitting(true);
            setSubmitStatus('idle');

            // Mock API call - replace with actual implementation
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Contact form submitted:', formData);
            setSubmitStatus('success');
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <section className="relative min-h-[70vh] bg-gray-900">
                {/* Background with code snippets */}
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full relative overflow-hidden bg-gray-900">
                        {/* Code snippets overlay */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-20 left-10 text-orange-400 font-mono text-xs">
                                <div>const contact = {`{`}</div>
                                <div>&nbsp;&nbsp;email: &quot;support@f-learning.com&quot;,</div>
                                <div>&nbsp;&nbsp;phone: &quot;+84 123 456 789&quot;</div>
                                <div>{`}`};</div>
                            </div>
                            <div className="absolute top-40 right-20 text-blue-400 font-mono text-xs">
                                <div>function help() {`{`}</div>
                                <div>&nbsp;&nbsp;return &quot;24/7 support&quot;;</div>
                                <div>{`}`}</div>
                            </div>
                            <div className="absolute bottom-40 left-20 text-purple-400 font-mono text-xs">
                                <div>if (question) {`{`}</div>
                                <div>&nbsp;&nbsp;contactUs();</div>
                                <div>{`}`}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 flex items-center min-h-[70vh]">
                    <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
                        <div className="text-white">
                            {/* Badge */}
                            <div className="inline-block">
                                <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">Contact & Support</span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                                Liên hệ <span className="text-orange-400">hỗ trợ</span> chúng tôi
                            </h1>

                            {/* Sub text */}
                            <p className="mt-4 text-base md:text-lg text-gray-100 max-w-3xl">
                                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại tin nhắn hoặc liên hệ trực tiếp với đội ngũ chuyên nghiệp của chúng tôi.
                            </p>

                            {/* CTA */}
                            <div className="pt-5">
                                <a
                                    href="#contact-form"
                                    className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white text-base font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                >
                                    Gửi tin nhắn ngay
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </a>
                            </div>

                            {/* Chips */}
                            <div className="mt-6 flex flex-wrap gap-2">
                                {['Hỗ trợ 24/7', 'Phản hồi nhanh', 'Chuyên nghiệp', 'Tận tâm', 'Đáng tin cậy'].map((t) => (
                                    <span key={t} className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-white/10 border border-white/20">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </MotionWrapper>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <MotionWrapper animation="fadeInLeft" duration={0.6} delay={0.2} mode="mount">
                        <div id="contact-form" className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Gửi tin nhắn cho chúng tôi
                                </h2>
                                <p className="text-gray-600">
                                    Điền thông tin vào form bên dưới và chúng tôi sẽ phản hồi trong thời gian sớm nhất.
                                </p>
                            </div>

                            <ContactForm
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                submitStatus={submitStatus}
                            />
                        </div>
                    </MotionWrapper>

                    {/* Contact Info & Map */}
                    <MotionWrapper animation="fadeInRight" duration={0.6} delay={0.4} mode="mount">
                        <div className="space-y-8">
                            {/* Contact Information */}
                            <ContactInfo />

                            {/* Map */}
                            <ContactMap />
                        </div>
                    </MotionWrapper>
                </div>

                {/* Additional Info */}
                <MotionWrapper animation="fadeInUp" duration={0.6} delay={0.6} mode="mount">
                    <div className="mt-16 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Tại sao chọn chúng tôi?
                            </h3>
                            <p className="text-gray-600 max-w-3xl mx-auto">
                                Chúng tôi cam kết mang đến dịch vụ tốt nhất và hỗ trợ khách hàng 24/7
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Hỗ trợ 24/7</h4>
                                <p className="text-gray-600 text-sm">
                                    Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc, mọi nơi
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Phản hồi nhanh</h4>
                                <p className="text-gray-600 text-sm">
                                    Chúng tôi cam kết phản hồi trong vòng 24 giờ làm việc
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Chất lượng đảm bảo</h4>
                                <p className="text-gray-600 text-sm">
                                    Dịch vụ chất lượng cao với đội ngũ chuyên nghiệp
                                </p>
                            </div>
                        </div>
                    </div>
                </MotionWrapper>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
