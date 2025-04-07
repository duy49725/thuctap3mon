import React, { useEffect, useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2 } from 'lucide-react';
import { GetCountries, IpAddress, SendEmail } from '@/config/api';
import { validateEmail, validateFullName, validateMessage, validatePhone } from '@/config/validate';

interface Country {
    country_name: string;
    dialling_code: string;
}

interface InlineErrorProps {
    error?: string;
}

interface FormState {
    fullName: string;
    email: string;
    phone: string;
    message: string;
}

const InlineError: React.FC<InlineErrorProps> = ({ error }) => {
    if (!error) return null;
    return <p className="mt-1 text-sm text-red-600 font-medium">{error}</p>;
};

const Contact: React.FC = () => {
    const [form, setForm] = useState<FormState>({
        fullName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [errors, setErrors] = useState<Partial<FormState>>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [ipData, setIpData] = useState<any>();
    const [countries, setCountries] = useState<Country[]>([]); 
    const [country, setCountry] = useState<string>('Viet Nam');
    const [send, setSend] = useState<boolean>(false);

    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('Bắt đầu tải dữ liệu...');
                if (!ipData) await IpAddress({ setLoading, setIpData });
                if (!countries.length) {
                    const countriesData = await GetCountries({ setLoading, setCountries });
                    console.log('Dữ liệu countries:', countriesData); 
                    if (!Array.isArray(countriesData)) {
                        throw new Error('Dữ liệu countries không phải mảng');
                    }
                    setCountries(countriesData);
                }
                setLoading(false);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
                toast({
                    title: 'Lỗi',
                    description: 'Không thể tải dữ liệu ban đầu',
                    variant: 'destructive',
                });
                setLoading(false);
            }
        };

        fetchData();
    }, []); // Chỉ chạy khi mount

    // Validate form
    useEffect(() => {
        console.log('Đang validate form...');
        validateFullName({ fullName: form.fullName, setFullNameError: (error) => setErrors((prev) => ({ ...prev, fullName: error })) });
        validateEmail({ email: form.email, setEmailError: (error) => setErrors((prev) => ({ ...prev, email: error })) });
        validatePhone({ phone: form.phone, setPhoneError: (error) => setErrors((prev) => ({ ...prev, phone: error })) });
        validateMessage({ message: form.message, setMessageError: (error) => setErrors((prev) => ({ ...prev, message: error })) });
    }, [form.fullName, form.email, form.phone, form.message]);

    // Xử lý gửi thành công
    useEffect(() => {
        if (send) {
            console.log('Gửi thành công, reset form...');
            toast({
                title: 'Thành công',
                description: 'Tin nhắn đã được gửi!',
            });
            setForm({ fullName: '', email: '', phone: '', message: '' });
            setErrors({});
            setSend(false);
        }
    }, [send]);

    const submitHandler = async (e: FormEvent) => {
        e.preventDefault();
        console.log('Submit form...');
        setButtonLoading(true);

        if (!Object.values(errors).some(Boolean)) {
            try {
                const selectedCountry = countries.find((c) => c.country_name === country);
                const phoneFull = selectedCountry ? selectedCountry.dialling_code.concat(form.phone) : form.phone;
                await SendEmail({
                    fullName: form.fullName,
                    email: form.email,
                    phone: phoneFull,
                    message: form.message,
                    setSend,
                });
            } catch (error) {
                console.error('Lỗi khi gửi email:', error);
                toast({
                    title: 'Lỗi',
                    description: 'Không thể gửi tin nhắn',
                    variant: 'destructive',
                });
            } finally {
                setButtonLoading(false);
            }
        } else {
            toast({
                title: 'Lỗi Form',
                description: 'Vui lòng sửa các lỗi trong form',
                variant: 'destructive',
            });
            setButtonLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    console.log('Render giao diện chính...');
    return (
        <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white shadow-xl rounded-xl p-8">
                        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
                            Liên hệ với chúng tôi
                        </h1>
                        <form onSubmit={submitHandler} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-gray-700">Họ và tên</Label>
                                <Input
                                    required
                                    value={form.fullName}
                                    onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
                                    placeholder="Nhập tên của bạn"
                                    className="w-full"
                                />
                                <InlineError error={errors.fullName} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-700">Email</Label>
                                <Input
                                    required
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                                    placeholder="Nhập email của bạn"
                                    className="w-full"
                                />
                                <InlineError error={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-700">Số điện thoại</Label>
                                <div className="flex gap-2">
                                    <Select value={country} onValueChange={setCountry}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Chọn quốc gia" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Quốc gia</SelectLabel>
                                                {countries.map((c, index) => (
                                                    <SelectItem key={index} value={c.country_name}>
                                                        {c.country_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        required
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                                        placeholder="Số điện thoại"
                                        className="flex-1"
                                    />
                                </div>
                                <InlineError error={errors.phone} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-gray-700">Tin nhắn</Label>
                                <Textarea
                                    required
                                    value={form.message}
                                    onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                                    placeholder="Chúng tôi có thể giúp gì cho bạn?"
                                    className="min-h-[120px]"
                                />
                                <InlineError error={errors.message} />
                            </div>

                            <Button
                                type="submit"
                                disabled={buttonLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                            >
                                {buttonLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Mail className="mr-2 h-4 w-4" />
                                )}
                                {buttonLoading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                            </Button>
                        </form>
                    </div>

                    <div className="h-[500px] rounded-xl overflow-hidden shadow-xl">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1706.7613312020935!2d105.77621101750509!3d21.03897088879833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454c98b0023d9%3A0xcb63ee13ef718b22!2zS8OtIHTDumMgeMOhIFRyxrDhu51nZyBDYW8gxJHhurNuZyBNw7ph!5e1!3m2!1sen!2s!4v1731253445889!5m2!1sen!2s"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;