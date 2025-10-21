import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield, AlertTriangle, FileText, ExternalLink, Scale, Users, Eye } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Legal Disclaimer | Barclayne',
  description: 'Legal disclaimer and terms of use for Barclayne. Important information about financial responsibility and data accuracy.',
  robots: 'index, follow'
}

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-2xl mb-6">
              <Scale className="w-8 h-8 text-slate-700 dark:text-slate-300" />
            </div>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Legal Disclaimer
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Important information about your use of Barclayne Financial Markets Intelligence Platform
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Navigation</h3>
                <nav className="space-y-2">
                  <a href="#financial-responsibility" className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Financial Responsibility</a>
                  <a href="#data-accuracy" className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Data Accuracy</a>
                  <a href="#liability" className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Liability</a>
                  <a href="#third-party" className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Third Party Services</a>
                  <a href="#modifications" className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Modifications</a>
                  <a href="#agreement" className="block text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Agreement</a>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-8">
                {/* Warning Notice */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                        Important Legal Notice
                      </h2>
                      <p className="text-amber-800 dark:text-amber-200">
                        Please read this disclaimer carefully before using Barclayne. By using our service, you acknowledge that you have read, understood, and agree to be bound by these terms.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial Responsibility */}
                <section id="financial-responsibility" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Financial Responsibility & Disclaimer
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                            No Financial Advice
                          </h3>
                          <p className="text-blue-800 dark:text-blue-200 mb-4">
                            <strong>Barclayne does not provide financial advice.</strong> All information, data, analysis, and content provided on our platform is for informational and educational purposes only. Nothing on our website should be construed as financial, investment, trading, or any other form of advice.
                          </p>
                          <p className="text-blue-800 dark:text-blue-200">
                            You are solely responsible for your financial decisions and any consequences that may result from them.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                            User Responsibility
                          </h3>
                          <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                            <li className="flex items-start gap-3">
                              <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span>You are responsible for conducting your own research and due diligence before making any financial decisions</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span>You must verify all information independently and not rely solely on data provided by Barclayne</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span>You acknowledge that all trading, investment, and financial activities carry inherent risks</span>
                            </li>
                            <li className="flex items-start gap-3">
                              <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></span>
                              <span>You understand that past performance does not guarantee future results</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Data Accuracy */}
                <section id="data-accuracy" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Data Accuracy & Information
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                            No Warranty on Accuracy
                          </h3>
                          <p className="text-green-800 dark:text-green-200 mb-4">
                            <strong>Barclayne takes no responsibility for the accuracy, completeness, or timeliness of any information provided on our platform.</strong> While we strive to provide accurate and up-to-date information, we make no warranties or representations regarding the accuracy of any data, news, analysis, or other content.
                          </p>
                          <p className="text-green-800 dark:text-green-200">
                            We continuously work to improve our data quality and accuracy, but we cannot guarantee that all information is error-free or current.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                            Third-Party Content
                          </h3>
                          <p className="text-slate-700 dark:text-slate-300 mb-4">
                            Our platform aggregates content from various sources including news websites, APIs, and other third-party providers. We do not control or verify the accuracy of this third-party content and disclaim any responsibility for its accuracy or reliability.
                          </p>
                          <p className="text-slate-700 dark:text-slate-300">
                            Users should independently verify any information before making decisions based on it.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Broker & Platform Links */}
                <section id="third-party" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      External Links & Brokers
                    </h2>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-3">
                          No Endorsement of Brokers or Platforms
                        </h3>
                        <p className="text-orange-800 dark:text-orange-200 mb-4">
                          <strong>Barclayne does not endorse, recommend, or take responsibility for any brokers, exchanges, trading platforms, or financial services providers that may be linked to or mentioned on our platform.</strong>
                        </p>
                        <ul className="space-y-2 text-orange-800 dark:text-orange-200">
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>You are solely responsible for researching and evaluating any brokers or platforms before using their services</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>We are not liable for any losses, damages, or issues arising from your use of external platforms or services</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>You should verify the legitimacy, security, and regulatory compliance of any platform before depositing funds or trading</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Limitation of Liability */}
                <section id="liability" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Limitation of Liability
                    </h2>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-3">
                          No Liability for Financial Losses
                        </h3>
                        <p className="text-red-800 dark:text-red-200 mb-4">
                          <strong>Barclayne shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages resulting from:</strong>
                        </p>
                        <ul className="space-y-2 text-red-800 dark:text-red-200">
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Your use of or reliance on any information provided on our platform</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Any financial decisions you make based on our content</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Inaccuracies, errors, or omissions in our data or content</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Your use of any external platforms or services linked from our site</span>
                          </li>
                          <li className="flex items-start gap-3">
                            <span className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span>Any interruption or cessation of our services</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* General Terms */}
                <section id="modifications" className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      General Terms
                    </h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                            Service Availability
                          </h3>
                          <p className="text-slate-700 dark:text-slate-300">
                            Barclayne reserves the right to modify, suspend, or discontinue any part of our service at any time without notice. We do not guarantee uninterrupted access to our platform.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                            Changes to Terms
                          </h3>
                          <p className="text-slate-700 dark:text-slate-300">
                            We may update this legal disclaimer at any time. Continued use of our service after changes constitutes acceptance of the new terms.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                          <ExternalLink className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                            Contact Information
                          </h3>
                          <p className="text-slate-700 dark:text-slate-300">
                            If you have any questions about this legal disclaimer, please contact us through our website or support channels.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Final Notice */}
                <section id="agreement" className="mb-8">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                          Final Notice
                        </h3>
                        <p className="text-blue-800 dark:text-blue-200">
                          <strong>By using Barclayne, you acknowledge that you have read, understood, and agree to be bound by this legal disclaimer.</strong> If you do not agree with any part of these terms, please do not use our service.
                        </p>
                        <p className="text-blue-800 dark:text-blue-200 mt-3">
                          Remember: Always do your own research and consult with qualified financial professionals before making any investment decisions.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}