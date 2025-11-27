

export default function Footer() {

    return (
        <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4">DTE DigiPay</h3>
                        <p className="text-sm">
                            Directorate of Technical Education<br />
                            Padmavilasom Road, Fort P.O<br />
                            Thiruvananthapuram, Kerala
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-white">About Us</a></li>
                            <li><a href="#" className="hover:text-white">Contact</a></li>
                            <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
                            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Helpline: 0471-2345678</li>
                            <li>Email: support@dtekerala.gov.in</li>
                            <li>Working Hours: 10 AM - 5 PM</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-medium mb-4">Legal</h4>
                        <p className="text-xs text-slate-400">
                            Content owned, maintained and updated by Directorate of Technical Education, Government of Kerala.
                        </p>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
                    &copy; {new Date().getFullYear()} Directorate of Technical Education, Kerala. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
