import axios from "axios";

// Interface cho dữ liệu quốc gia
interface Country {
    country_name: string;
    dialling_code: string;
}

// Hàm lấy địa chỉ IP và quốc gia
export const IpAddress = async ({
    setLoading,
    setIpData,
}: {
    setLoading: (loading: boolean) => void;
    setIpData: (data: string) => void;
}) => {
    try {
        const res = await axios.get("http://api.ipstack.com/check?access_key=e98574de00e44fd897dc8dec454d22dd");
        if (res && res.data) {
            setLoading(false);
            setIpData(res.data.country_name);
        }
    } catch (error: any) {
        console.error(`IP Address Error: ${error.message}`);
        alert(`IP Address Error: ${error.message}`);
        setLoading(false);
    }
};

// Hàm lấy danh sách quốc gia
export const GetCountries = async ({
    setLoading,
    setCountries,
}: {
    setLoading: (loading: boolean) => void;
    setCountries: (countries: Country[]) => void; // Sửa thành Country[]
}) => {
    try {
        const res = await axios.get(`https://api.apilayer.com/number_verification/countries`, {
            headers: {
                apikey: 'YsziDyek62lC0X1r5nj9X60oWMAXYpWE',
            },
        });
        if (res && res.data) {
            // Chuyển object thành mảng
            const countriesArray: Country[] = Object.values(res.data);
            console.log('Countries array:', countriesArray); // Debug dữ liệu
            setCountries(countriesArray);
            setLoading(false);
        }
    } catch (error: any) {
        console.error('GetCountries Error:', error);
        alert(error?.response?.data?.message || "Lỗi không xác định khi lấy danh sách quốc gia");
        setLoading(false);
    }
};

// Hàm gửi email
export const SendEmail = async ({
    fullName,
    email,
    phone,
    message,
    setSend,
}: {
    fullName: string;
    email: string;
    phone: string;
    message: string;
    setSend: (response: boolean) => void; 
}) => {
    try {
        const datas = { fullName, email, phone, message };
        const res = await axios.post("http://localhost:3000/send", datas);
        if (res && res.data) {
            setSend(true); 
        }
    } catch (error: any) {
        console.error('SendEmail Error:', error);
        alert(error?.response?.data?.message || "Lỗi không xác định khi gửi email");
        throw error; 
    }
};