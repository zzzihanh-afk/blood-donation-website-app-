/**
 * Comprehensive Bangladesh Administrative Hierarchy
 * Covers:
 * - 8 Divisions
 * - 64 Districts (with Bengali & English names)
 * - Upazilas & Thanas per District (with bilingual support)
 */

export interface LocationEntry {
  id: string;
  nameEn: string;
  nameBn: string;
}

export interface DistrictEntry extends LocationEntry {
  divisionEn: string;
  divisionBn: string;
}

export const BANGLADESH_DIVISIONS: LocationEntry[] = [
  { id: 'div-dha', nameEn: 'Dhaka', nameBn: 'ঢাকা' },
  { id: 'div-ctg', nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম' },
  { id: 'div-raj', nameEn: 'Rajshahi', nameBn: 'রাজশাহী' },
  { id: 'div-khu', nameEn: 'Khulna', nameBn: 'খুলনা' },
  { id: 'div-bar', nameEn: 'Barishal', nameBn: 'বরিশাল' },
  { id: 'div-syl', nameEn: 'Sylhet', nameBn: 'সিলেট' },
  { id: 'div-ran', nameEn: 'Rangpur', nameBn: 'রংপুর' },
  { id: 'div-mym', nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ' }
];

export const BANGLADESH_DISTRICTS: Record<string, DistrictEntry[]> = {
  Dhaka: [
    { id: 'dist-dhaka', nameEn: 'Dhaka', nameBn: 'ঢাকা', divisionEn: 'Dhaka', divisionBn: 'ঢাকা' },
    { id: 'dist-gazipur', nameEn: 'Gazipur', nameBn: 'গাজীপুর', divisionEn: 'Dhaka', divisionBn: 'ঢাকা' },
    { id: 'dist-narayanganj', nameEn: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা' },
    { id: 'dist-tangail', nameEn: 'Tangail', nameBn: 'টাঙ্গাইল', divisionEn: 'Dhaka', divisionBn: 'ঢাকা' },
    { id: 'dist-faridpur', nameEn: 'Faridpur', nameBn: 'ফরিদপুর', divisionEn: 'Dhaka', divisionBn: 'ঢাকা' },
    { id: 'dist-manikganj', nameEn: 'Manikganj', nameBn: 'মানিকগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা' },
    { id: 'dist-munshiganj', nameEn: 'Munshiganj', nameBn: 'মুন্সীগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা' },
    { id: 'dist-narsingdi', nameEn: 'Narsingdi', nameBn: 'নরসিংদী', divisionEn: 'Dhaka', divisionBn: 'ঢাকা' },
    { id: 'dist-gopalganj', nameEn: 'Gopalganj', nameBn: 'গোপালগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা' },
    { id: 'dist-kishoreganj', nameEn: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', divisionEn: 'Dhaka', divisionBn: 'ঢাকা' },
    { id: 'dist-madaripur', nameEn: 'Madaripur', nameBn: 'মাদারীপুর', divisionEn: 'Dhaka', divisionBn: 'ঢাকা' },
    { id: 'dist-rajbari', nameEn: 'Rajbari', nameBn: 'রাজবাড়ী', divisionEn: 'Dhaka', divisionBn: 'ঢাকা' },
    { id: 'dist-shariatpur', nameEn: 'Shariatpur', nameBn: 'শরীয়তপুর', divisionEn: 'Dhaka', divisionBn: 'ঢাকা' }
  ],
  Chattogram: [
    { id: 'dist-chattogram', nameEn: 'Chattogram', nameBn: 'চট্টগ্রাম', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম' },
    { id: 'dist-coxsbazar', nameEn: "Cox's Bazar", nameBn: 'কক্সবাজার', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম' },
    { id: 'dist-cumilla', nameEn: 'Cumilla', nameBn: 'কুমিল্লা', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম' },
    { id: 'dist-feni', nameEn: 'Feni', nameBn: 'ফেনী', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম' },
    { id: 'dist-brahmanbaria', nameEn: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম' },
    { id: 'dist-chandpur', nameEn: 'Chandpur', nameBn: 'চাঁদপুর', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম' },
    { id: 'dist-lakshmipur', nameEn: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম' },
    { id: 'dist-noakhali', nameEn: 'Noakhali', nameBn: 'নোয়াখালী', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম' },
    { id: 'dist-khagrachhari', nameEn: 'Khagrachhari', nameBn: 'খাগড়াছড়ি', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম' },
    { id: 'dist-rangamati', nameEn: 'Rangamati', nameBn: 'রাঙ্গামাটি', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম' },
    { id: 'dist-bandarban', nameEn: 'Bandarban', nameBn: 'বান্দরবান', divisionEn: 'Chattogram', divisionBn: 'চট্টগ্রাম' }
  ],
  Rajshahi: [
    { id: 'dist-rajshahi', nameEn: 'Rajshahi', nameBn: 'রাজশাহী', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী' },
    { id: 'dist-bogura', nameEn: 'Bogura', nameBn: 'বগুড়া', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী' },
    { id: 'dist-pabna', nameEn: 'Pabna', nameBn: 'পাবনা', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী' },
    { id: 'dist-sirajganj', nameEn: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী' },
    { id: 'dist-naogaon', nameEn: 'Naogaon', nameBn: 'নওগাঁ', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী' },
    { id: 'dist-natore', nameEn: 'Natore', nameBn: 'নাটোর', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী' },
    { id: 'dist-chapainawabganj', nameEn: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী' },
    { id: 'dist-joypurhat', nameEn: 'Joypurhat', nameBn: 'জয়পুরহাট', divisionEn: 'Rajshahi', divisionBn: 'রাজশাহী' }
  ],
  Khulna: [
    { id: 'dist-khulna', nameEn: 'Khulna', nameBn: 'খুলনা', divisionEn: 'Khulna', divisionBn: 'খুলনা' },
    { id: 'dist-jashore', nameEn: 'Jashore', nameBn: 'যশোর', divisionEn: 'Khulna', divisionBn: 'খুলনা' },
    { id: 'dist-kushtia', nameEn: 'Kushtia', nameBn: 'কুষ্টিয়া', divisionEn: 'Khulna', divisionBn: 'খুলনা' },
    { id: 'dist-jhenaidah', nameEn: 'Jhenaidah', nameBn: 'ঝিনাইদহ', divisionEn: 'Khulna', divisionBn: 'খুলনা' },
    { id: 'dist-satkhira', nameEn: 'Satkhira', nameBn: 'সাতক্ষীরা', divisionEn: 'Khulna', divisionBn: 'খুলনা' },
    { id: 'dist-bagerhat', nameEn: 'Bagerhat', nameBn: 'বাগেরহাট', divisionEn: 'Khulna', divisionBn: 'খুলনা' },
    { id: 'dist-chuadanga', nameEn: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', divisionEn: 'Khulna', divisionBn: 'খুলনা' },
    { id: 'dist-meherpur', nameEn: 'Meherpur', nameBn: 'মেহেরপুর', divisionEn: 'Khulna', divisionBn: 'খুলনা' },
    { id: 'dist-magura', nameEn: 'Magura', nameBn: 'মাগুরা', divisionEn: 'Khulna', divisionBn: 'খুলনা' },
    { id: 'dist-narail', nameEn: 'Narail', nameBn: 'নড়াইল', divisionEn: 'Khulna', divisionBn: 'খুলনা' }
  ],
  Barishal: [
    { id: 'dist-barishal', nameEn: 'Barishal', nameBn: 'বরিশাল', divisionEn: 'Barishal', divisionBn: 'বরিশাল' },
    { id: 'dist-patuakhali', nameEn: 'Patuakhali', nameBn: 'পটুয়াখালী', divisionEn: 'Barishal', divisionBn: 'বরিশাল' },
    { id: 'dist-bhola', nameEn: 'Bhola', nameBn: 'ভোলা', divisionEn: 'Barishal', divisionBn: 'বরিশাল' },
    { id: 'dist-pirojpur', nameEn: 'Pirojpur', nameBn: 'পিরোজপুর', divisionEn: 'Barishal', divisionBn: 'বরিশাল' },
    { id: 'dist-barguna', nameEn: 'Barguna', nameBn: 'বরগুনা', divisionEn: 'Barishal', divisionBn: 'বরিশাল' },
    { id: 'dist-jhalokati', nameEn: 'Jhalokati', nameBn: 'ঝালকাঠি', divisionEn: 'Barishal', divisionBn: 'বরিশাল' }
  ],
  Sylhet: [
    { id: 'dist-sylhet', nameEn: 'Sylhet', nameBn: 'সিলেট', divisionEn: 'Sylhet', divisionBn: 'সিলেট' },
    { id: 'dist-moulvibazar', nameEn: 'Moulvibazar', nameBn: 'মৌলভীবাজার', divisionEn: 'Sylhet', divisionBn: 'সিলেট' },
    { id: 'dist-habiganj', nameEn: 'Habiganj', nameBn: 'হবিগঞ্জ', divisionEn: 'Sylhet', divisionBn: 'সিলেট' },
    { id: 'dist-sunamganj', nameEn: 'Sunamganj', nameBn: 'সুনামগঞ্জ', divisionEn: 'Sylhet', divisionBn: 'সিলেট' }
  ],
  Rangpur: [
    { id: 'dist-rangpur', nameEn: 'Rangpur', nameBn: 'রংপুর', divisionEn: 'Rangpur', divisionBn: 'রংপুর' },
    { id: 'dist-dinajpur', nameEn: 'Dinajpur', nameBn: 'দিনাজপুর', divisionEn: 'Rangpur', divisionBn: 'রংপুর' },
    { id: 'dist-gaibandha', nameEn: 'Gaibandha', nameBn: 'গাইবান্ধা', divisionEn: 'Rangpur', divisionBn: 'রংপুর' },
    { id: 'dist-kurigram', nameEn: 'Kurigram', nameBn: 'কুড়িগ্রাম', divisionEn: 'Rangpur', divisionBn: 'রংপুর' },
    { id: 'dist-lalmonirhat', nameEn: 'Lalmonirhat', nameBn: 'লালমনিরহাট', divisionEn: 'Rangpur', divisionBn: 'রংপুর' },
    { id: 'dist-nilphamari', nameEn: 'Nilphamari', nameBn: 'নীলফামারী', divisionEn: 'Rangpur', divisionBn: 'রংপুর' },
    { id: 'dist-panchagarh', nameEn: 'Panchagarh', nameBn: 'পঞ্চগড়', divisionEn: 'Rangpur', divisionBn: 'রংপুর' },
    { id: 'dist-thakurgaon', nameEn: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও', divisionEn: 'Rangpur', divisionBn: 'রংপুর' }
  ],
  Mymensingh: [
    { id: 'dist-mymensingh', nameEn: 'Mymensingh', nameBn: 'ময়মনসিংহ', divisionEn: 'Mymensingh', divisionBn: 'ময়মনসিংহ' },
    { id: 'dist-jamalpur', nameEn: 'Jamalpur', nameBn: 'জামালপুর', divisionEn: 'Mymensingh', divisionBn: 'ময়মনসিংহ' },
    { id: 'dist-netrokona', nameEn: 'Netrokona', nameBn: 'নেত্রকোণা', divisionEn: 'Mymensingh', divisionBn: 'ময়মনসিংহ' },
    { id: 'dist-sherpur', nameEn: 'Sherpur', nameBn: 'শেরপুর', divisionEn: 'Mymensingh', divisionBn: 'ময়মনসিংহ' }
  ]
};

export const BANGLADESH_UPAZILAS: Record<string, LocationEntry[]> = {
  // --- DHAKA DIVISION ---
  Dhaka: [
    { id: 'upz-dhanmondi', nameEn: 'Dhanmondi', nameBn: 'ধানমন্ডি' },
    { id: 'upz-mirpur', nameEn: 'Mirpur', nameBn: 'মিরপুর' },
    { id: 'upz-uttara', nameEn: 'Uttara', nameBn: 'উত্তরা' },
    { id: 'upz-gulshan', nameEn: 'Gulshan', nameBn: 'গুলশান' },
    { id: 'upz-banani', nameEn: 'Banani', nameBn: 'বনানী' },
    { id: 'upz-mohammadpur', nameEn: 'Mohammadpur', nameBn: 'মোহাম্মদপুর' },
    { id: 'upz-savar', nameEn: 'Savar', nameBn: 'সাভার' },
    { id: 'upz-keraniganj', nameEn: 'Keraniganj', nameBn: 'কেরানীগঞ্জ' },
    { id: 'upz-dhamrai', nameEn: 'Dhamrai', nameBn: 'ধামরাই' },
    { id: 'upz-dohar', nameEn: 'Dohar', nameBn: 'দোহার' },
    { id: 'upz-nawabganj', nameEn: 'Nawabganj', nameBn: 'নবাবগঞ্জ' },
    { id: 'upz-badda', nameEn: 'Badda', nameBn: 'বাড্ডা' },
    { id: 'upz-motijheel', nameEn: 'Motijheel', nameBn: 'মতিঝিল' },
    { id: 'upz-tejgaon', nameEn: 'Tejgaon', nameBn: 'তেজগাঁও' },
    { id: 'upz-khilgaon', nameEn: 'Khilgaon', nameBn: 'খিলগাঁও' },
    { id: 'upz-lalbagh', nameEn: 'Lalbagh', nameBn: 'লালবাগ' },
    { id: 'upz-jatrabari', nameEn: 'Jatrabari', nameBn: 'যাত্রাবাড়ী' },
    { id: 'upz-pallabi', nameEn: 'Pallabi', nameBn: 'পল্লবী' },
    { id: 'upz-ramna', nameEn: 'Ramna', nameBn: 'রমনা' },
    { id: 'upz-shahbagh', nameEn: 'Shahbagh', nameBn: 'শাহবাগ' }
  ],
  Gazipur: [
    { id: 'upz-gz-sadar', nameEn: 'Gazipur Sadar', nameBn: 'গাজীপুর সদর' },
    { id: 'upz-gz-tongi', nameEn: 'Tongi', nameBn: 'টঙ্গী' },
    { id: 'upz-gz-kaliakair', nameEn: 'Kaliakair', nameBn: 'কালিয়াকৈর' },
    { id: 'upz-gz-sreepur', nameEn: 'Sreepur', nameBn: 'শ্রীপুর' },
    { id: 'upz-gz-kapasia', nameEn: 'Kapasia', nameBn: 'কাপাসিয়া' },
    { id: 'upz-gz-kaliganj', nameEn: 'Kaliganj', nameBn: 'কালীগঞ্জ' }
  ],
  Narayanganj: [
    { id: 'upz-ng-sadar', nameEn: 'Narayanganj Sadar', nameBn: 'নারায়ণগঞ্জ সদর' },
    { id: 'upz-ng-bandar', nameEn: 'Bandar', nameBn: 'বন্দর' },
    { id: 'upz-ng-rupganj', nameEn: 'Rupganj', nameBn: 'রূপগঞ্জ' },
    { id: 'upz-ng-sonargaon', nameEn: 'Sonargaon', nameBn: 'সোনারগাঁও' },
    { id: 'upz-ng-araihazar', nameEn: 'Araihazar', nameBn: 'আড়াইহাজার' },
    { id: 'upz-ng-fatullah', nameEn: 'Fatullah', nameBn: 'ফতুল্লা' },
    { id: 'upz-ng-siddhirganj', nameEn: 'Siddhirganj', nameBn: 'সিদ্ধিরগঞ্জ' }
  ],
  Tangail: [
    { id: 'upz-tg-sadar', nameEn: 'Tangail Sadar', nameBn: 'টাঙ্গাইল সদর' },
    { id: 'upz-tg-mirzapur', nameEn: 'Mirzapur', nameBn: 'মির্জাপুর' },
    { id: 'upz-tg-ghatail', nameEn: 'Ghatail', nameBn: 'ঘাটাইল' },
    { id: 'upz-tg-madhupur', nameEn: 'Madhupur', nameBn: 'মধুপুর' },
    { id: 'upz-tg-kalihati', nameEn: 'Kalihati', nameBn: 'কালিহাতী' },
    { id: 'upz-tg-gopalpur', nameEn: 'Gopalpur', nameBn: 'গোপালপুর' },
    { id: 'upz-tg-sakhipur', nameEn: 'Sakhipur', nameBn: 'সখিপুর' },
    { id: 'upz-tg-bhuapur', nameEn: 'Bhuapur', nameBn: 'ভূঞাপুর' },
    { id: 'upz-tg-delduar', nameEn: 'Delduar', nameBn: 'দেলদুয়ার' },
    { id: 'upz-tg-basail', nameEn: 'Basail', nameBn: 'বাসাইল' },
    { id: 'upz-tg-nagarpur', nameEn: 'Nagarpur', nameBn: 'নাগরপুর' },
    { id: 'upz-tg-dhanbari', nameEn: 'Dhanbari', nameBn: 'ধনবাড়ী' }
  ],
  Faridpur: [
    { id: 'upz-fd-sadar', nameEn: 'Faridpur Sadar', nameBn: 'ফরিদপুর সদর' },
    { id: 'upz-fd-boalmari', nameEn: 'Boalmari', nameBn: 'বোয়ালমারী' },
    { id: 'upz-fd-bhanga', nameEn: 'Bhanga', nameBn: 'ভাঙ্গা' },
    { id: 'upz-fd-madhukhali', nameEn: 'Madhukhali', nameBn: 'মধুখালী' },
    { id: 'upz-fd-nagarkanda', nameEn: 'Nagarkanda', nameBn: 'নগরকান্দা' },
    { id: 'upz-fd-alfadanga', nameEn: 'Alfadanga', nameBn: 'আলফাডাঙ্গা' },
    { id: 'upz-fd-sadarpur', nameEn: 'Sadarpur', nameBn: 'সদরপুর' },
    { id: 'upz-fd-charbhadrasan', nameEn: 'Charbhadrasan', nameBn: 'চরভদ্রাসন' },
    { id: 'upz-fd-saltha', nameEn: 'Saltha', nameBn: 'সালথা' }
  ],
  Manikganj: [
    { id: 'upz-mg-sadar', nameEn: 'Manikganj Sadar', nameBn: 'মানিকগঞ্জ সদর' },
    { id: 'upz-mg-singair', nameEn: 'Singair', nameBn: 'সিংগাইর' },
    { id: 'upz-mg-shibalaya', nameEn: 'Shibalaya', nameBn: 'শিবালয়' },
    { id: 'upz-mg-saturia', nameEn: 'Saturia', nameBn: 'সাটুরিয়া' },
    { id: 'upz-mg-harirampur', nameEn: 'Harirampur', nameBn: 'হরিরামপুর' },
    { id: 'upz-mg-ghior', nameEn: 'Ghior', nameBn: 'ঘিওর' },
    { id: 'upz-mg-daulatpur', nameEn: 'Daulatpur', nameBn: 'দৌলতপুর' }
  ],
  Munshiganj: [
    { id: 'upz-ms-sadar', nameEn: 'Munshiganj Sadar', nameBn: 'মুন্সীগঞ্জ সদর' },
    { id: 'upz-ms-sreenagar', nameEn: 'Sreenagar', nameBn: 'শ্রীনগর' },
    { id: 'upz-ms-sirajdikhan', nameEn: 'Sirajdikhan', nameBn: 'সিরাজদিখান' },
    { id: 'upz-ms-louhajang', nameEn: 'Louhajang', nameBn: 'লৌহজং' },
    { id: 'upz-ms-tongibari', nameEn: 'Tongibari', nameBn: 'টংগিবাড়ী' },
    { id: 'upz-ms-gazaria', nameEn: 'Gazaria', nameBn: 'গজারিয়া' }
  ],
  Narsingdi: [
    { id: 'upz-ns-sadar', nameEn: 'Narsingdi Sadar', nameBn: 'নরসিংদী সদর' },
    { id: 'upz-ns-palash', nameEn: 'Palash', nameBn: 'পলাশ' },
    { id: 'upz-ns-shibpur', nameEn: 'Shibpur', nameBn: 'শিবপুর' },
    { id: 'upz-ns-raipura', nameEn: 'Raipura', nameBn: 'রায়পুরা' },
    { id: 'upz-ns-monohardi', nameEn: 'Monohardi', nameBn: 'মনোহরদী' },
    { id: 'upz-ns-belabo', nameEn: 'Belabo', nameBn: 'বেলাবো' }
  ],
  Gopalganj: [
    { id: 'upz-gp-sadar', nameEn: 'Gopalganj Sadar', nameBn: 'গোপালগঞ্জ সদর' },
    { id: 'upz-gp-kashiani', nameEn: 'Kashiani', nameBn: 'কাশিয়ানী' },
    { id: 'upz-gp-kotalipara', nameEn: 'Kotalipara', nameBn: 'কোটালীপাড়া' },
    { id: 'upz-gp-muksudpur', nameEn: 'Muksudpur', nameBn: 'মুকসুদপুর' },
    { id: 'upz-gp-tungipara', nameEn: 'Tungipara', nameBn: 'টুঙ্গিপাড়া' }
  ],
  Kishoreganj: [
    { id: 'upz-ks-sadar', nameEn: 'Kishoreganj Sadar', nameBn: 'কিশোরগঞ্জ সদর' },
    { id: 'upz-ks-bhairab', nameEn: 'Bhairab', nameBn: 'ভৈরব' },
    { id: 'upz-ks-bajitpur', nameEn: 'Bajitpur', nameBn: 'বাজিতপুর' },
    { id: 'upz-ks-hossainpur', nameEn: 'Hossainpur', nameBn: 'হোসেনপুর' },
    { id: 'upz-ks-katiadi', nameEn: 'Katiadi', nameBn: 'কটিয়াদী' },
    { id: 'upz-ks-kuliarchar', nameEn: 'Kuliarchar', nameBn: 'কুলিয়ারচর' },
    { id: 'upz-ks-pakundia', nameEn: 'Pakundia', nameBn: 'পাকুন্দিয়া' },
    { id: 'upz-ks-tarail', nameEn: 'Tarail', nameBn: 'তাড়াইল' },
    { id: 'upz-ks-karimganj', nameEn: 'Karimganj', nameBn: 'করিমগঞ্জ' },
    { id: 'upz-ks-itna', nameEn: 'Itna', nameBn: 'ইটনা' },
    { id: 'upz-ks-mithamain', nameEn: 'Mithamain', nameBn: 'মিঠামইন' },
    { id: 'upz-ks-nikli', nameEn: 'Nikli', nameBn: 'নিকলী' }
  ],
  Madaripur: [
    { id: 'upz-md-sadar', nameEn: 'Madaripur Sadar', nameBn: 'মাদারীপুর সদর' },
    { id: 'upz-md-shibchar', nameEn: 'Shibchar', nameBn: 'শিবচর' },
    { id: 'upz-md-kalkini', nameEn: 'Kalkini', nameBn: 'কালকিনি' },
    { id: 'upz-md-rajoir', nameEn: 'Rajoir', nameBn: 'রাজৈর' },
    { id: 'upz-md-dasar', nameEn: 'Dasar', nameBn: 'ডাসার' }
  ],
  Rajbari: [
    { id: 'upz-rb-sadar', nameEn: 'Rajbari Sadar', nameBn: 'রাজবাড়ী সদর' },
    { id: 'upz-rb-goalanda', nameEn: 'Goalanda', nameBn: 'গোয়ালন্দ' },
    { id: 'upz-rb-pangsha', nameEn: 'Pangsha', nameBn: 'পাংশা' },
    { id: 'upz-rb-baliakandi', nameEn: 'Baliakandi', nameBn: 'বালিয়াকান্দি' },
    { id: 'upz-rb-kalukhali', nameEn: 'Kalukhali', nameBn: 'কালুখালী' }
  ],
  Shariatpur: [
    { id: 'upz-sp-sadar', nameEn: 'Shariatpur Sadar', nameBn: 'শরীয়তপুর সদর' },
    { id: 'upz-sp-damudya', nameEn: 'Damudya', nameBn: 'ডামুড্যা' },
    { id: 'upz-sp-naria', nameEn: 'Naria', nameBn: 'নড়িয়া' },
    { id: 'upz-sp-jajira', nameEn: 'Jajira', nameBn: 'জাজিরা' },
    { id: 'upz-sp-bhedarganj', nameEn: 'Bhedarganj', nameBn: 'ভেদরগঞ্জ' },
    { id: 'upz-sp-gosairhat', nameEn: 'Gosairhat', nameBn: 'গোসাইরহাট' }
  ],

  // --- CHATTOGRAM DIVISION ---
  Chattogram: [
    { id: 'upz-ctg-kotwali', nameEn: 'Kotwali', nameBn: 'কোতোয়ালী' },
    { id: 'upz-ctg-panchlaish', nameEn: 'Panchlaish', nameBn: 'পাঁচলাইশ' },
    { id: 'upz-ctg-pahartali', nameEn: 'Pahartali', nameBn: 'পাহাড়তলী' },
    { id: 'upz-ctg-halishahar', nameEn: 'Halishahar', nameBn: 'হালিশহর' },
    { id: 'upz-ctg-khulshi', nameEn: 'Khulshi', nameBn: 'খুলশী' },
    { id: 'upz-ctg-patenga', nameEn: 'Patenga', nameBn: 'পতেঙ্গা' },
    { id: 'upz-ctg-doublemooring', nameEn: 'Double Mooring', nameBn: 'ডবলমুরিং' },
    { id: 'upz-ctg-bandar', nameEn: 'Bandar', nameBn: 'বন্দর' },
    { id: 'upz-ctg-bayazid', nameEn: 'Bayazid', nameBn: 'বায়োজিদ' },
    { id: 'upz-ctg-hathazari', nameEn: 'Hathazari', nameBn: 'হাটহাজারী' },
    { id: 'upz-ctg-sitakunda', nameEn: 'Sitakunda', nameBn: 'সীতাকুণ্ড' },
    { id: 'upz-ctg-mirsharai', nameEn: 'Mirsharai', nameBn: 'মীরসরাই' },
    { id: 'upz-ctg-patiya', nameEn: 'Patiya', nameBn: 'পটিয়া' },
    { id: 'upz-ctg-boalkhali', nameEn: 'Boalkhali', nameBn: 'বোয়ালখালী' },
    { id: 'upz-ctg-anwara', nameEn: 'Anwara', nameBn: 'আনোয়ারা' },
    { id: 'upz-ctg-chandanaish', nameEn: 'Chandanaish', nameBn: 'চন্দনাইশ' },
    { id: 'upz-ctg-fatikchhari', nameEn: 'Fatikchhari', nameBn: 'ফটিকছড়ি' },
    { id: 'upz-ctg-banshkhali', nameEn: 'Banshkhali', nameBn: 'বাঁশখালী' },
    { id: 'upz-ctg-lohagara', nameEn: 'Lohagara', nameBn: 'লোহাগাড়া' },
    { id: 'upz-ctg-satkania', nameEn: 'Satkania', nameBn: 'সাতকানিয়া' },
    { id: 'upz-ctg-raozan', nameEn: 'Raozan', nameBn: 'রাউজান' },
    { id: 'upz-ctg-rangunia', nameEn: 'Rangunia', nameBn: 'রাঙ্গুনিয়া' },
    { id: 'upz-ctg-sandwip', nameEn: 'Sandwip', nameBn: 'সন্দ্বীপ' },
    { id: 'upz-ctg-karnaphuli', nameEn: 'Karnaphuli', nameBn: 'কর্ণফুলী' }
  ],
  "Cox's Bazar": [
    { id: 'upz-cb-sadar', nameEn: "Cox's Bazar Sadar", nameBn: 'কক্সবাজার সদর' },
    { id: 'upz-cb-chakaria', nameEn: 'Chakaria', nameBn: 'চকোরিয়া' },
    { id: 'upz-cb-maheshkhali', nameEn: 'Maheshkhali', nameBn: 'মহেশখালী' },
    { id: 'upz-cb-teknaf', nameEn: 'Teknaf', nameBn: 'টেকনাফ' },
    { id: 'upz-cb-ukhiya', nameEn: 'Ukhiya', nameBn: 'উখিয়া' },
    { id: 'upz-cb-ramu', nameEn: 'Ramu', nameBn: 'রামু' },
    { id: 'upz-cb-pekua', nameEn: 'Pekua', nameBn: 'পেকুয়া' },
    { id: 'upz-cb-kutubdia', nameEn: 'Kutubdia', nameBn: 'কুতুবদিয়া' },
    { id: 'upz-cb-eidgaon', nameEn: 'Eidgaon', nameBn: 'ঈদগাঁও' }
  ],
  Cumilla: [
    { id: 'upz-cm-adarsha', nameEn: 'Cumilla Adarsha Sadar', nameBn: 'কুমিল্লা আদর্শ সদর' },
    { id: 'upz-cm-sadardakshin', nameEn: 'Cumilla Sadar Dakshin', nameBn: 'কুমিল্লা সদর দক্ষিণ' },
    { id: 'upz-cm-barura', nameEn: 'Barura', nameBn: 'বরুড়া' },
    { id: 'upz-cm-brahmanpara', nameEn: 'Brahmanpara', nameBn: 'ব্রাহ্মণপাড়া' },
    { id: 'upz-cm-burichang', nameEn: 'Burichang', nameBn: 'বুড়িচং' },
    { id: 'upz-cm-chandina', nameEn: 'Chandina', nameBn: 'চান্দিনা' },
    { id: 'upz-cm-chauddagram', nameEn: 'Chauddagram', nameBn: 'চৌদ্দগ্রাম' },
    { id: 'upz-cm-daudkandi', nameEn: 'Daudkandi', nameBn: 'দাউদকান্দি' },
    { id: 'upz-cm-debidwar', nameEn: 'Debidwar', nameBn: 'দেবিদ্বার' },
    { id: 'upz-cm-homna', nameEn: 'Homna', nameBn: 'হোমনা' },
    { id: 'upz-cm-laksam', nameEn: 'Laksam', nameBn: 'লাকসাম' },
    { id: 'upz-cm-muradnagar', nameEn: 'Muradnagar', nameBn: 'মুরাদনগর' },
    { id: 'upz-cm-nangalkot', nameEn: 'Nangalkot', nameBn: 'নাঙ্গলকোট' },
    { id: 'upz-cm-meghna', nameEn: 'Meghna', nameBn: 'মেঘনা' },
    { id: 'upz-cm-titas', nameEn: 'Titas', nameBn: 'তিতাস' },
    { id: 'upz-cm-monohargonj', nameEn: 'Monohargonj', nameBn: 'মনোহরগঞ্জ' },
    { id: 'upz-cm-lalmai', nameEn: 'Lalmai', nameBn: 'লালমাই' }
  ],
  Feni: [
    { id: 'upz-fn-sadar', nameEn: 'Feni Sadar', nameBn: 'ফেনী সদর' },
    { id: 'upz-fn-daganbhuiyan', nameEn: 'Daganbhuiyan', nameBn: 'দাগনভূঞা' },
    { id: 'upz-fn-chhagalnaiya', nameEn: 'Chhagalnaiya', nameBn: 'ছাগলনাইয়া' },
    { id: 'upz-fn-sonagazi', nameEn: 'Sonagazi', nameBn: 'সোনাগাজী' },
    { id: 'upz-fn-parshuram', nameEn: 'Parshuram', nameBn: 'পরশুরাম' },
    { id: 'upz-fn-fulgazi', nameEn: 'Fulgazi', nameBn: 'ফুলগাজী' }
  ],
  Brahmanbaria: [
    { id: 'upz-bb-sadar', nameEn: 'Brahmanbaria Sadar', nameBn: 'ব্রাহ্মণবাড়িয়া সদর' },
    { id: 'upz-bb-ashuganj', nameEn: 'Ashuganj', nameBn: 'আশুগঞ্জ' },
    { id: 'upz-bb-sarail', nameEn: 'Sarail', nameBn: 'সরাইল' },
    { id: 'upz-bb-nabinagar', nameEn: 'Nabinagar', nameBn: 'নবীনগর' },
    { id: 'upz-bb-nasirnagar', nameEn: 'Nasirnagar', nameBn: 'নাসিরনগর' },
    { id: 'upz-bb-kasba', nameEn: 'Kasba', nameBn: 'কসবা' },
    { id: 'upz-bb-akhaura', nameEn: 'Akhaura', nameBn: 'আখাউড়া' },
    { id: 'upz-bb-bancharampur', nameEn: 'Bancharampur', nameBn: 'বাঞ্ছারামপুর' },
    { id: 'upz-bb-bijoynagar', nameEn: 'Bijoynagar', nameBn: 'বিজয়নগর' }
  ],
  Chandpur: [
    { id: 'upz-cp-sadar', nameEn: 'Chandpur Sadar', nameBn: 'চাঁদপুর সদর' },
    { id: 'upz-cp-faridganj', nameEn: 'Faridganj', nameBn: 'ফরিদগঞ্জ' },
    { id: 'upz-cp-haziganj', nameEn: 'Haziganj', nameBn: 'হাজীগঞ্জ' },
    { id: 'upz-cp-haimchar', nameEn: 'Haimchar', nameBn: 'হাইমচর' },
    { id: 'upz-cp-kachua', nameEn: 'Kachua', nameBn: 'কচুয়া' },
    { id: 'upz-cp-matlabdakshin', nameEn: 'Matlab Dakshin', nameBn: 'মতলব দক্ষিণ' },
    { id: 'upz-cp-matlabuttar', nameEn: 'Matlab Uttar', nameBn: 'মতলব উত্তর' },
    { id: 'upz-cp-shahrasti', nameEn: 'Shahrasti', nameBn: 'শাহরাস্তি' }
  ],
  Lakshmipur: [
    { id: 'upz-lp-sadar', nameEn: 'Lakshmipur Sadar', nameBn: 'লক্ষ্মীপুর সদর' },
    { id: 'upz-lp-raipur', nameEn: 'Raipur', nameBn: 'রায়পুর' },
    { id: 'upz-lp-ramganj', nameEn: 'Ramganj', nameBn: 'রামগঞ্জ' },
    { id: 'upz-lp-ramgati', nameEn: 'Ramgati', nameBn: 'রামগতি' },
    { id: 'upz-lp-kamalnagar', nameEn: 'Kamalnagar', nameBn: 'কমলনগর' }
  ],
  Noakhali: [
    { id: 'upz-nk-sadar', nameEn: 'Noakhali Sadar (Sudharam)', nameBn: 'নোয়াখালী সদর (সুধারাম)' },
    { id: 'upz-nk-begumganj', nameEn: 'Begumganj', nameBn: 'বেগমগঞ্জ' },
    { id: 'upz-nk-chatkhil', nameEn: 'Chatkhil', nameBn: 'চাটখিল' },
    { id: 'upz-nk-companiganj', nameEn: 'Companiganj', nameBn: 'কোম্পানীগঞ্জ' },
    { id: 'upz-nk-hatiya', nameEn: 'Hatiya', nameBn: 'হাতিয়া' },
    { id: 'upz-nk-senbagh', nameEn: 'Senbagh', nameBn: 'সেনবাগ' },
    { id: 'upz-nk-sonaimuri', nameEn: 'Sonaimuri', nameBn: 'সোনাইমুড়ী' },
    { id: 'upz-nk-subarnachar', nameEn: 'Subarnachar', nameBn: 'সুবর্ণচর' },
    { id: 'upz-nk-kabirhat', nameEn: 'Kabirhat', nameBn: 'কবিরহাট' }
  ],
  Khagrachhari: [
    { id: 'upz-kh-sadar', nameEn: 'Khagrachhari Sadar', nameBn: 'খাগড়াছড়ি সদর' },
    { id: 'upz-kh-dighinala', nameEn: 'Dighinala', nameBn: 'দিঘীনালা' },
    { id: 'upz-kh-panchhari', nameEn: 'Panchhari', nameBn: 'পানছড়ি' },
    { id: 'upz-kh-matiranga', nameEn: 'Matiranga', nameBn: 'মাটিরাঙ্গা' },
    { id: 'upz-kh-ramgarh', nameEn: 'Ramgarh', nameBn: 'রামগড়' },
    { id: 'upz-kh-manikchhari', nameEn: 'Manikchhari', nameBn: 'মানিকছড়ি' },
    { id: 'upz-kh-mahalchhari', nameEn: 'Mahalchhari', nameBn: 'মহালছড়ি' },
    { id: 'upz-kh-guimara', nameEn: 'Guimara', nameBn: 'গুইমারা' }
  ],
  Rangamati: [
    { id: 'upz-rm-sadar', nameEn: 'Rangamati Sadar', nameBn: 'রাঙ্গামাটি সদর' },
    { id: 'upz-rm-kaptai', nameEn: 'Kaptai', nameBn: 'কাপ্তাই' },
    { id: 'upz-rm-baghaichhari', nameEn: 'Baghaichhari', nameBn: 'বাঘাইছড়ি' },
    { id: 'upz-rm-barkal', nameEn: 'Barkal', nameBn: 'বরকল' },
    { id: 'upz-rm-langadu', nameEn: 'Langadu', nameBn: 'লংগদু' },
    { id: 'upz-rm-naniarchar', nameEn: 'Naniarchar', nameBn: 'নানিয়ারচর' },
    { id: 'upz-rm-rajasthali', nameEn: 'Rajasthali', nameBn: 'রাজস্থলী' },
    { id: 'upz-rm-kawkhali', nameEn: 'Kawkhali', nameBn: 'কাউখালী' }
  ],
  Bandarban: [
    { id: 'upz-bd-sadar', nameEn: 'Bandarban Sadar', nameBn: 'বান্দরবান সদর' },
    { id: 'upz-bd-lama', nameEn: 'Lama', nameBn: 'লামা' },
    { id: 'upz-bd-ruma', nameEn: 'Ruma', nameBn: 'রুমা' },
    { id: 'upz-bd-thanchi', nameEn: 'Thanchi', nameBn: 'থানচি' },
    { id: 'upz-bd-alikadam', nameEn: 'Alikadam', nameBn: 'আলীকদম' },
    { id: 'upz-bd-naikhongchhari', nameEn: 'Naikhongchhari', nameBn: 'নাইক্ষ্যংছড়ি' },
    { id: 'upz-bd-rowangchhari', nameEn: 'Rowangchhari', nameBn: 'রোয়াংছড়ি' }
  ],

  // --- RAJSHAHI DIVISION ---
  Rajshahi: [
    { id: 'upz-rj-boalia', nameEn: 'Boalia', nameBn: 'বোয়ালিয়া' },
    { id: 'upz-rj-rajpara', nameEn: 'Rajpara', nameBn: 'রাজপাড়া' },
    { id: 'upz-rj-motihar', nameEn: 'Motihar', nameBn: 'মতিহার' },
    { id: 'upz-rj-shahmakhdum', nameEn: 'Shah Makhdum', nameBn: 'শাহ মখদুম' },
    { id: 'upz-rj-paba', nameEn: 'Paba', nameBn: 'পবা' },
    { id: 'upz-rj-godagari', nameEn: 'Godagari', nameBn: 'গোদাগাড়ী' },
    { id: 'upz-rj-tanore', nameEn: 'Tanore', nameBn: 'তানোর' },
    { id: 'upz-rj-bagmara', nameEn: 'Bagmara', nameBn: 'বাগমারা' },
    { id: 'upz-rj-durgapur', nameEn: 'Durgapur', nameBn: 'দুর্গাপুর' },
    { id: 'upz-rj-charghat', nameEn: 'Charghat', nameBn: 'চারঘাট' },
    { id: 'upz-rj-puthia', nameEn: 'Puthia', nameBn: 'পুঠিয়া' },
    { id: 'upz-rj-bagha', nameEn: 'Bagha', nameBn: 'বাঘা' },
    { id: 'upz-rj-mohanpur', nameEn: 'Mohanpur', nameBn: 'মোহনপুর' }
  ],
  Bogura: [
    { id: 'upz-bg-sadar', nameEn: 'Bogura Sadar', nameBn: 'বগুড়া সদর' },
    { id: 'upz-bg-shibganj', nameEn: 'Shibganj', nameBn: 'শিবগঞ্জ' },
    { id: 'upz-bg-sherpur', nameEn: 'Sherpur', nameBn: 'শেরপুর' },
    { id: 'upz-bg-gabtali', nameEn: 'Gabtali', nameBn: 'গাবতলী' },
    { id: 'upz-bg-shajahanpur', nameEn: 'Shajahanpur', nameBn: 'শাজাহানপুর' },
    { id: 'upz-bg-kahaloo', nameEn: 'Kahaloo', nameBn: 'কাহালু' },
    { id: 'upz-bg-dhunat', nameEn: 'Dhunat', nameBn: 'ধুনট' },
    { id: 'upz-bg-sonatola', nameEn: 'Sonatola', nameBn: 'সোনাতলা' },
    { id: 'upz-bg-sariakandi', nameEn: 'Sariakandi', nameBn: 'সারিয়াকান্দি' },
    { id: 'upz-bg-nandigram', nameEn: 'Nandigram', nameBn: 'নন্দীগ্রাম' },
    { id: 'upz-bg-dupchanchia', nameEn: 'Dupchanchia', nameBn: 'দুপচাঁচিয়া' },
    { id: 'upz-bg-adamdighi', nameEn: 'Adamdighi', nameBn: 'আদমদীঘি' }
  ],
  Pabna: [
    { id: 'upz-pb-sadar', nameEn: 'Pabna Sadar', nameBn: 'পাবনা সদর' },
    { id: 'upz-pb-ishwardi', nameEn: 'Ishwardi', nameBn: 'ঈশ্বরদী' },
    { id: 'upz-pb-bera', nameEn: 'Bera', nameBn: 'বেড়া' },
    { id: 'upz-pb-santhia', nameEn: 'Santhia', nameBn: 'সাঁথিয়া' },
    { id: 'upz-pb-sujanagar', nameEn: 'Sujanagar', nameBn: 'সুজানগর' },
    { id: 'upz-pb-chatmohar', nameEn: 'Chatmohar', nameBn: 'চাটমোহর' },
    { id: 'upz-pb-bhangura', nameEn: 'Bhangura', nameBn: 'ভাঙ্গুড়া' },
    { id: 'upz-pb-atgharia', nameEn: 'Atgharia', nameBn: 'আটঘরিয়া' },
    { id: 'upz-pb-faridpur', nameEn: 'Faridpur', nameBn: 'ফরিদপুর' }
  ],
  Sirajganj: [
    { id: 'upz-sj-sadar', nameEn: 'Sirajganj Sadar', nameBn: 'সিরাজগঞ্জ সদর' },
    { id: 'upz-sj-shahjadpur', nameEn: 'Shahjadpur', nameBn: 'শাহজাদপুর' },
    { id: 'upz-sj-ullapara', nameEn: 'Ullapara', nameBn: 'উল্লাপাড়া' },
    { id: 'upz-sj-belkuchi', nameEn: 'Belkuchi', nameBn: 'বেলকুচি' },
    { id: 'upz-sj-kazipur', nameEn: 'Kazipur', nameBn: 'কাজীপুর' },
    { id: 'upz-sj-raiganj', nameEn: 'Raiganj', nameBn: 'রায়গঞ্জ' },
    { id: 'upz-sj-tarash', nameEn: 'Tarash', nameBn: 'তাড়াশ' },
    { id: 'upz-sj-kamarkhanda', nameEn: 'Kamarkhanda', nameBn: 'কামারখন্দ' },
    { id: 'upz-sj-chauhali', nameEn: 'Chauhali', nameBn: 'চৌহালী' }
  ],
  Naogaon: [
    { id: 'upz-no-sadar', nameEn: 'Naogaon Sadar', nameBn: 'নওগাঁ সদর' },
    { id: 'upz-no-patnitala', nameEn: 'Patnitala', nameBn: 'পত্নীতলা' },
    { id: 'upz-no-manda', nameEn: 'Manda', nameBn: 'মান্দা' },
    { id: 'upz-no-mohadevpur', nameEn: 'Mohadevpur', nameBn: 'মহাদেবপুর' },
    { id: 'upz-no-badalgachhi', nameEn: 'Badalgachhi', nameBn: 'বদলগাছী' },
    { id: 'upz-no-dhamoirhat', nameEn: 'Dhamoirhat', nameBn: 'ধামইরহাট' },
    { id: 'upz-no-niamatpur', nameEn: 'Niamatpur', nameBn: 'নিয়ামতপুর' },
    { id: 'upz-no-raninagar', nameEn: 'Raninagar', nameBn: 'রাণীনগর' },
    { id: 'upz-no-porsha', nameEn: 'Porsha', nameBn: 'পোরশা' },
    { id: 'upz-no-sapahar', nameEn: 'Sapahar', nameBn: 'সাপাহার' },
    { id: 'upz-no-atrai', nameEn: 'Atrai', nameBn: 'আত্রাই' }
  ],
  Natore: [
    { id: 'upz-nt-sadar', nameEn: 'Natore Sadar', nameBn: 'নাটোর সদর' },
    { id: 'upz-nt-singra', nameEn: 'Singra', nameBn: 'সিংড়া' },
    { id: 'upz-nt-baraigram', nameEn: 'Baraigram', nameBn: 'বড়াইগ্রাম' },
    { id: 'upz-nt-gurudaspur', nameEn: 'Gurudaspur', nameBn: 'গুরুদাসপুর' },
    { id: 'upz-nt-lalpur', nameEn: 'Lalpur', nameBn: 'লালপুর' },
    { id: 'upz-nt-bagatipara', nameEn: 'Bagatipara', nameBn: 'বাগাতিপাড়া' },
    { id: 'upz-nt-naldanga', nameEn: 'Naldanga', nameBn: 'নলডাঙ্গা' }
  ],
  Chapainawabganj: [
    { id: 'upz-cn-sadar', nameEn: 'Chapainawabganj Sadar', nameBn: 'চাঁপাইনবাবগঞ্জ সদর' },
    { id: 'upz-cn-shibganj', nameEn: 'Shibganj', nameBn: 'শিবগঞ্জ' },
    { id: 'upz-cn-gomastapur', nameEn: 'Gomastapur', nameBn: 'গোমস্তাপুর' },
    { id: 'upz-cn-nachole', nameEn: 'Nachole', nameBn: 'নাচোল' },
    { id: 'upz-cn-bholahat', nameEn: 'Bholahat', nameBn: 'ভোলাহাট' }
  ],
  Joypurhat: [
    { id: 'upz-jp-sadar', nameEn: 'Joypurhat Sadar', nameBn: 'জয়পুরহাট সদর' },
    { id: 'upz-jp-panchbibi', nameEn: 'Panchbibi', nameBn: 'পাঁচবিবি' },
    { id: 'upz-jp-akkelpur', nameEn: 'Akkelpur', nameBn: 'আক্কেলপুর' },
    { id: 'upz-jp-kalai', nameEn: 'Kalai', nameBn: 'কালাই' },
    { id: 'upz-jp-khetlal', nameEn: 'Khetlal', nameBn: 'ক্ষেতলাল' }
  ],

  // --- KHULNA DIVISION ---
  Khulna: [
    { id: 'upz-kl-sadar', nameEn: 'Khulna Sadar', nameBn: 'খুলনা সদর' },
    { id: 'upz-kl-sonadanga', nameEn: 'Sonadanga', nameBn: 'সোনাডাঙ্গা' },
    { id: 'upz-kl-khalishpur', nameEn: 'Khalishpur', nameBn: 'খালিশপুর' },
    { id: 'upz-kl-daulatpur', nameEn: 'Daulatpur', nameBn: 'দৌলতপুর' },
    { id: 'upz-kl-khanjahanali', nameEn: 'Khan Jahan Ali', nameBn: 'খান জাহান আলী' },
    { id: 'upz-kl-dumuria', nameEn: 'Dumuria', nameBn: 'ডুমুরিয়া' },
    { id: 'upz-kl-batiaghata', nameEn: 'Batiaghata', nameBn: 'বটিয়াঘাটা' },
    { id: 'upz-kl-paikgachha', nameEn: 'Paikgachha', nameBn: 'পাইকগাছা' },
    { id: 'upz-kl-koyra', nameEn: 'Koyra', nameBn: 'কয়রা' },
    { id: 'upz-kl-phultala', nameEn: 'Phultala', nameBn: 'ফুলতলা' },
    { id: 'upz-kl-dighalia', nameEn: 'Dighalia', nameBn: 'দিঘলিয়া' },
    { id: 'upz-kl-rupsha', nameEn: 'Rupsha', nameBn: 'রূপসা' },
    { id: 'upz-kl-terokhada', nameEn: 'Terokhada', nameBn: 'তেরখাদা' },
    { id: 'upz-kl-dacope', nameEn: 'Dacope', nameBn: 'দাকোপ' }
  ],
  Jashore: [
    { id: 'upz-js-sadar', nameEn: 'Jashore Sadar', nameBn: 'যশোর সদর' },
    { id: 'upz-js-manirampur', nameEn: 'Manirampur', nameBn: 'মণিরামপুর' },
    { id: 'upz-js-keshabpur', nameEn: 'Keshabpur', nameBn: 'কেশবপুর' },
    { id: 'upz-js-sharsha', nameEn: 'Sharsha', nameBn: 'শার্শা' },
    { id: 'upz-js-abhaynagar', nameEn: 'Abhaynagar', nameBn: 'অভয়নগর' },
    { id: 'upz-js-bagherpara', nameEn: 'Bagherpara', nameBn: 'বাঘারপাড়া' },
    { id: 'upz-js-chaugachha', nameEn: 'Chaugachha', nameBn: 'চৌগাছা' },
    { id: 'upz-js-jhikargachha', nameEn: 'Jhikargachha', nameBn: 'ঝিকরগাছা' }
  ],
  Kushtia: [
    { id: 'upz-kt-sadar', nameEn: 'Kushtia Sadar', nameBn: 'কুষ্টিয়া সদর' },
    { id: 'upz-kt-kumarkhali', nameEn: 'Kumarkhali', nameBn: 'কুমারখালী' },
    { id: 'upz-kt-daulatpur', nameEn: 'Daulatpur', nameBn: 'দৌলতপুর' },
    { id: 'upz-kt-bheramara', nameEn: 'Bheramara', nameBn: 'ভেড়ামারা' },
    { id: 'upz-kt-mirpur', nameEn: 'Mirpur', nameBn: 'মিরপুর' },
    { id: 'upz-kt-khoksa', nameEn: 'Khoksa', nameBn: 'খোকসা' }
  ],
  Jhenaidah: [
    { id: 'upz-jh-sadar', nameEn: 'Jhenaidah Sadar', nameBn: 'ঝিনাইদহ সদর' },
    { id: 'upz-jh-kaliganj', nameEn: 'Kaliganj', nameBn: 'কালীগঞ্জ' },
    { id: 'upz-jh-kotchandpur', nameEn: 'Kotchandpur', nameBn: 'কোটচাঁদপুর' },
    { id: 'upz-jh-maheshpur', nameEn: 'Maheshpur', nameBn: 'মহেশপুর' },
    { id: 'upz-jh-shailkupa', nameEn: 'Shailkupa', nameBn: 'শৈলকুপা' },
    { id: 'upz-jh-harinakunda', nameEn: 'Harinakunda', nameBn: 'হরিণাকুণ্ডু' }
  ],
  Satkhira: [
    { id: 'upz-sk-sadar', nameEn: 'Satkhira Sadar', nameBn: 'সাতক্ষীরা সদর' },
    { id: 'upz-sk-kalaroa', nameEn: 'Kalaroa', nameBn: 'কলারোয়া' },
    { id: 'upz-sk-kaliganj', nameEn: 'Kaliganj', nameBn: 'কালীগঞ্জ' },
    { id: 'upz-sk-shyamnagar', nameEn: 'Shyamnagar', nameBn: 'শ্যামনগর' },
    { id: 'upz-sk-assasuni', nameEn: 'Assasuni', nameBn: 'আশাশুনি' },
    { id: 'upz-sk-tala', nameEn: 'Tala', nameBn: 'তালা' },
    { id: 'upz-sk-debhata', nameEn: 'Debhata', nameBn: 'দেবহাটা' }
  ],
  Bagerhat: [
    { id: 'upz-bg-sadar2', nameEn: 'Bagerhat Sadar', nameBn: 'বাগেরহাট সদর' },
    { id: 'upz-bg-mongla', nameEn: 'Mongla', nameBn: 'মোংলা' },
    { id: 'upz-bg-morrelganj', nameEn: 'Morrelganj', nameBn: 'মোরেলগঞ্জ' },
    { id: 'upz-bg-rampal', nameEn: 'Rampal', nameBn: 'রামপাল' },
    { id: 'upz-bg-fakirhat', nameEn: 'Fakirhat', nameBn: 'ফকিরহাট' },
    { id: 'upz-bg-kachua2', nameEn: 'Kachua', nameBn: 'কচুয়া' },
    { id: 'upz-bg-chitalmari', nameEn: 'Chitalmari', nameBn: 'চিতলমারী' },
    { id: 'upz-bg-mollahat', nameEn: 'Mollahat', nameBn: 'মোল্লাহাট' },
    { id: 'upz-bg-sarankhola', nameEn: 'Sarankhola', nameBn: 'শরণখোলা' }
  ],
  Chuadanga: [
    { id: 'upz-cd-sadar', nameEn: 'Chuadanga Sadar', nameBn: 'চুয়াডাঙ্গা সদর' },
    { id: 'upz-cd-alamdanga', nameEn: 'Alamdanga', nameBn: 'আলমডাঙ্গা' },
    { id: 'upz-cd-damurhuda', nameEn: 'Damurhuda', nameBn: 'দামুড়হুদা' },
    { id: 'upz-cd-jibannagar', nameEn: 'Jibannagar', nameBn: 'জীবননগর' }
  ],
  Meherpur: [
    { id: 'upz-mh-sadar', nameEn: 'Meherpur Sadar', nameBn: 'মেহেরপুর সদর' },
    { id: 'upz-mh-gangni', nameEn: 'Gangni', nameBn: 'গাংনী' },
    { id: 'upz-mh-mujibnagar', nameEn: 'Mujibnagar', nameBn: 'মুজিবনগর' }
  ],
  Magura: [
    { id: 'upz-mg-sadar2', nameEn: 'Magura Sadar', nameBn: 'মাগুরা সদর' },
    { id: 'upz-mg-sreepur', nameEn: 'Sreepur', nameBn: 'শ্রীপুর' },
    { id: 'upz-mg-mohammadpur', nameEn: 'Mohammadpur', nameBn: 'মহম্মদপুর' },
    { id: 'upz-mg-shalikha', nameEn: 'Shalikha', nameBn: 'শালিখা' }
  ],
  Narail: [
    { id: 'upz-nr-sadar', nameEn: 'Narail Sadar', nameBn: 'নড়াইল সদর' },
    { id: 'upz-nr-kalia', nameEn: 'Kalia', nameBn: 'কালিয়া' },
    { id: 'upz-nr-lohagara', nameEn: 'Lohagara', nameBn: 'লোহাগড়া' }
  ],

  // --- BARISHAL DIVISION ---
  Barishal: [
    { id: 'upz-br-sadar', nameEn: 'Barishal Sadar (Kotwali)', nameBn: 'বরিশাল সদর (কোতোয়ালী)' },
    { id: 'upz-br-bakerganj', nameEn: 'Bakerganj', nameBn: 'বাকেরগঞ্জ' },
    { id: 'upz-br-babuganj', nameEn: 'Babuganj', nameBn: 'বাবুগঞ্জ' },
    { id: 'upz-br-wazirpur', nameEn: 'Wazirpur', nameBn: 'উজিরপুর' },
    { id: 'upz-br-banaripara', nameEn: 'Banaripara', nameBn: 'বানারীপাড়া' },
    { id: 'upz-br-gaurnadi', nameEn: 'Gaurnadi', nameBn: 'গৌরনদী' },
    { id: 'upz-br-agailjhara', nameEn: 'Agailjhara', nameBn: 'আগৈলঝাড়া' },
    { id: 'upz-br-mehendiganj', nameEn: 'Mehendiganj', nameBn: 'মেহেন্দিগঞ্জ' },
    { id: 'upz-br-muladi', nameEn: 'Muladi', nameBn: 'মুলাদী' },
    { id: 'upz-br-hizla', nameEn: 'Hizla', nameBn: 'হিজলা' }
  ],
  Patuakhali: [
    { id: 'upz-pt-sadar', nameEn: 'Patuakhali Sadar', nameBn: 'পটুয়াখালী সদর' },
    { id: 'upz-pt-galachipa', nameEn: 'Galachipa', nameBn: 'গলাচিপা' },
    { id: 'upz-pt-kalapara', nameEn: 'Kalapara', nameBn: 'কলাপাড়া' },
    { id: 'upz-pt-bauphal', nameEn: 'Bauphal', nameBn: 'বাউফল' },
    { id: 'upz-pt-mirzaganj', nameEn: 'Mirzaganj', nameBn: 'মির্জাগঞ্জ' },
    { id: 'upz-pt-dashmina', nameEn: 'Dashmina', nameBn: 'দশমিনা' },
    { id: 'upz-pt-dumki', nameEn: 'Dumki', nameBn: 'দুমকি' },
    { id: 'upz-pt-rangabali', nameEn: 'Rangabali', nameBn: 'রাঙ্গাবালী' }
  ],
  Bhola: [
    { id: 'upz-bh-sadar', nameEn: 'Bhola Sadar', nameBn: 'ভোলা সদর' },
    { id: 'upz-bh-charfasson', nameEn: 'Char Fasson', nameBn: 'চরফ্যাশন' },
    { id: 'upz-bh-burhanuddin', nameEn: 'Burhanuddin', nameBn: 'বোরহানউদ্দিন' },
    { id: 'upz-bh-lalmohan', nameEn: 'Lalmohan', nameBn: 'লালমোহন' },
    { id: 'upz-bh-daulatkhan', nameEn: 'Daulatkhan', nameBn: 'দৌলতখান' },
    { id: 'upz-bh-tazumuddin', nameEn: 'Tazumuddin', nameBn: 'তজুমদ্দিন' },
    { id: 'upz-bh-manpura', nameEn: 'Manpura', nameBn: 'মনপুরা' }
  ],
  Pirojpur: [
    { id: 'upz-pr-sadar', nameEn: 'Pirojpur Sadar', nameBn: 'পিরোজপুর সদর' },
    { id: 'upz-pr-mathbaria', nameEn: 'Mathbaria', nameBn: 'মঠবাড়িয়া' },
    { id: 'upz-pr-bhandaria', nameEn: 'Bhandaria', nameBn: 'ভাণ্ডারিয়া' },
    { id: 'upz-pr-nesarabad', nameEn: 'Nesarabad (Swarupkati)', nameBn: 'নেছারাবাদ (স্বরূপকাঠি)' },
    { id: 'upz-pr-nazirpur', nameEn: 'Nazirpur', nameBn: 'নাজিরপুর' },
    { id: 'upz-pr-kawkhali', nameEn: 'Kawkhali', nameBn: 'কাউখালী' },
    { id: 'upz-pr-indurkani', nameEn: 'Indurkani', nameBn: 'ইন্দুরকানী' }
  ],
  Barguna: [
    { id: 'upz-br-sadar2', nameEn: 'Barguna Sadar', nameBn: 'বরগুনা সদর' },
    { id: 'upz-br-amtali', nameEn: 'Amtali', nameBn: 'আমতলী' },
    { id: 'upz-br-patharghata', nameEn: 'Patharghata', nameBn: 'পাথরঘাটা' },
    { id: 'upz-br-betagi', nameEn: 'Betagi', nameBn: 'বেতাগী' },
    { id: 'upz-br-bamna', nameEn: 'Bamna', nameBn: 'বামনা' },
    { id: 'upz-br-taltali', nameEn: 'Taltali', nameBn: 'তালতলী' }
  ],
  Jhalokati: [
    { id: 'upz-jk-sadar', nameEn: 'Jhalokati Sadar', nameBn: 'ঝালকাঠি সদর' },
    { id: 'upz-jk-nalchhiti', nameEn: 'Nalchhiti', nameBn: 'নলছিটি' },
    { id: 'upz-jk-rajapur', nameEn: 'Rajapur', nameBn: 'রাজাপুর' },
    { id: 'upz-jk-kathalia', nameEn: 'Kathalia', nameBn: 'কাঠালিয়া' }
  ],

  // --- SYLHET DIVISION ---
  Sylhet: [
    { id: 'upz-sy-kotwali', nameEn: 'Kotwali', nameBn: 'কোতোয়ালী' },
    { id: 'upz-sy-sadar', nameEn: 'Sylhet Sadar', nameBn: 'সিলেট সদর' },
    { id: 'upz-sy-beanibazar', nameEn: 'Beanibazar', nameBn: 'বিয়ানীবাজার' },
    { id: 'upz-sy-golapganj', nameEn: 'Golapganj', nameBn: 'গোলাপগঞ্জ' },
    { id: 'upz-sy-dakshinsurma', nameEn: 'Dakshin Surma', nameBn: 'দক্ষিণ সুরমা' },
    { id: 'upz-sy-bishwanath', nameEn: 'Bishwanath', nameBn: 'বিশ্বনাথ' },
    { id: 'upz-sy-osmaninagar', nameEn: 'Osmani Nagar', nameBn: 'ওসমানীনগর' },
    { id: 'upz-sy-zakiganj', nameEn: 'Zakiganj', nameBn: 'জকিগঞ্জ' },
    { id: 'upz-sy-kanaighat', nameEn: 'Kanaighat', nameBn: 'কানাইঘাট' },
    { id: 'upz-sy-jaintiapur', nameEn: 'Jaintiapur', nameBn: 'জৈন্তাপুর' },
    { id: 'upz-sy-gowainghat', nameEn: 'Gowainghat', nameBn: 'গোয়াইনঘাট' },
    { id: 'upz-sy-companiganj', nameEn: 'Companiganj', nameBn: 'কোম্পানীগঞ্জ' },
    { id: 'upz-sy-fenchuganj', nameEn: 'Fenchuganj', nameBn: 'ফেঞ্চুগঞ্জ' }
  ],
  Moulvibazar: [
    { id: 'upz-mb-sadar', nameEn: 'Moulvibazar Sadar', nameBn: 'মৌলভীবাজার সদর' },
    { id: 'upz-mb-sreemangal', nameEn: 'Sreemangal', nameBn: 'শ্রীমঙ্গল' },
    { id: 'upz-mb-kulaura', nameEn: 'Kulaura', nameBn: 'কুলাউড়া' },
    { id: 'upz-mb-kamalganj', nameEn: 'Kamalganj', nameBn: 'কমলগঞ্জ' },
    { id: 'upz-mb-barlekha', nameEn: 'Barlekha', nameBn: 'বড়লেখা' },
    { id: 'upz-mb-rajnagar', nameEn: 'Rajnagar', nameBn: 'রাজনগর' },
    { id: 'upz-mb-juri', nameEn: 'Juri', nameBn: 'জুড়ী' }
  ],
  Habiganj: [
    { id: 'upz-hb-sadar', nameEn: 'Habiganj Sadar', nameBn: 'হবিগঞ্জ সদর' },
    { id: 'upz-hb-madhabpur', nameEn: 'Madhabpur', nameBn: 'মাধবপুর' },
    { id: 'upz-hb-nabiganj', nameEn: 'Nabiganj', nameBn: 'নবীগঞ্জ' },
    { id: 'upz-hb-chunarughat', nameEn: 'Chunarughat', nameBn: 'চুনারুঘাট' },
    { id: 'upz-hb-bahubal', nameEn: 'Bahubal', nameBn: 'বাহুবল' },
    { id: 'upz-hb-baniyachong', nameEn: 'Baniyachong', nameBn: 'বানিয়াচং' },
    { id: 'upz-hb-ajmiriganj', nameEn: 'Ajmiriganj', nameBn: 'আজমিরীগঞ্জ' },
    { id: 'upz-hb-lakhai', nameEn: 'Lakhai', nameBn: 'লাখাই' },
    { id: 'upz-hb-sayestaganj', nameEn: 'Sayestaganj', nameBn: 'শায়েস্তাগঞ্জ' }
  ],
  Sunamganj: [
    { id: 'upz-sm-sadar', nameEn: 'Sunamganj Sadar', nameBn: 'সুনামগঞ্জ সদর' },
    { id: 'upz-sm-chhatak', nameEn: 'Chhatak', nameBn: 'ছাতক' },
    { id: 'upz-sm-jagannathpur', nameEn: 'Jagannathpur', nameBn: 'জগন্নাথপুর' },
    { id: 'upz-sm-derai', nameEn: 'Derai', nameBn: 'দিরাই' },
    { id: 'upz-sm-tahirpur', nameEn: 'Tahirpur', nameBn: 'তাহিরপুর' },
    { id: 'upz-sm-dharmapasha', nameEn: 'Dharamapasha', nameBn: 'ধর্মপাশা' },
    { id: 'upz-sm-jamalganj', nameEn: 'Jamalganj', nameBn: 'জামালগঞ্জ' },
    { id: 'upz-sm-sullah', nameEn: 'Sullah', nameBn: 'শাল্লা' },
    { id: 'upz-sm-dowarabazar', nameEn: 'Dowarabazar', nameBn: 'দোয়ারাবাজার' },
    { id: 'upz-sm-bishwamvarpur', nameEn: 'Bishwamvarpur', nameBn: 'বিশ্বম্ভরপুর' },
    { id: 'upz-sm-shantiganj', nameEn: 'Shantiganj (South Sunamganj)', nameBn: 'শান্তিগঞ্জ (দক্ষিণ সুনামগঞ্জ)' }
  ],

  // --- RANGPUR DIVISION ---
  Rangpur: [
    { id: 'upz-rp-sadar', nameEn: 'Rangpur Sadar', nameBn: 'রংপুর সদর' },
    { id: 'upz-rp-mithapukur', nameEn: 'Mithapukur', nameBn: 'মিঠাপুকুর' },
    { id: 'upz-rp-pirganj', nameEn: 'Pirganj', nameBn: 'পীরগঞ্জ' },
    { id: 'upz-rp-badarganj', nameEn: 'Badarganj', nameBn: 'বদরগঞ্জ' },
    { id: 'upz-rp-pirgachha', nameEn: 'Pirgachha', nameBn: 'পীরগাছা' },
    { id: 'upz-rp-kaunia', nameEn: 'Kaunia', nameBn: 'কাউনিয়া' },
    { id: 'upz-rp-gangachhara', nameEn: 'Gangachhara', nameBn: 'গংগাচড়া' },
    { id: 'upz-rp-taraganj', nameEn: 'Taraganj', nameBn: 'তারাগঞ্জ' }
  ],
  Dinajpur: [
    { id: 'upz-dj-sadar', nameEn: 'Dinajpur Sadar', nameBn: 'দিনাজপুর সদর' },
    { id: 'upz-dj-parbatipur', nameEn: 'Parbatipur', nameBn: 'পার্বতীপুর' },
    { id: 'upz-dj-birganj', nameEn: 'Birganj', nameBn: 'বীরগঞ্জ' },
    { id: 'upz-dj-birampur', nameEn: 'Birampur', nameBn: 'বিরামপুর' },
    { id: 'upz-dj-chirirbandar', nameEn: 'Chirirbandar', nameBn: 'চিরিরবন্দর' },
    { id: 'upz-dj-fulbari', nameEn: 'Fulbari', nameBn: 'ফুলবাড়ী' },
    { id: 'upz-dj-nawabganj', nameEn: 'Nawabganj', nameBn: 'নবাবগঞ্জ' },
    { id: 'upz-dj-bochaganj', nameEn: 'Bochaganj', nameBn: 'বোচাগঞ্জ' },
    { id: 'upz-dj-birol', nameEn: 'Birol', nameBn: 'বিরল' },
    { id: 'upz-dj-ghoraghat', nameEn: 'Ghoraghat', nameBn: 'ঘোড়াঘাট' },
    { id: 'upz-dj-hakimpur', nameEn: 'Hakimpur', nameBn: 'হাকিমপুর' },
    { id: 'upz-dj-kaharole', nameEn: 'Kaharole', nameBn: 'কাহারোল' },
    { id: 'upz-dj-khansama', nameEn: 'Khansama', nameBn: 'খানসামা' }
  ],
  Gaibandha: [
    { id: 'upz-gb-sadar', nameEn: 'Gaibandha Sadar', nameBn: 'গাইবান্ধা সদর' },
    { id: 'upz-gb-gobindaganj', nameEn: 'Gobindaganj', nameBn: 'গোবিন্দগঞ্জ' },
    { id: 'upz-gb-sundarganj', nameEn: 'Sundarganj', nameBn: 'সুন্দরগঞ্জ' },
    { id: 'upz-gb-sadullapur', nameEn: 'Sadullapur', nameBn: 'সাদুল্লাপুর' },
    { id: 'upz-gb-palashbari', nameEn: 'Palashbari', nameBn: 'পলাশবাড়ী' },
    { id: 'upz-gb-sughatta', nameEn: 'Sughatta', nameBn: 'সাঘাটা' },
    { id: 'upz-gb-fulchhari', nameEn: 'Fulchhari', nameBn: 'ফুলছড়ি' }
  ],
  Kurigram: [
    { id: 'upz-kr-sadar', nameEn: 'Kurigram Sadar', nameBn: 'কুড়িগ্রাম সদর' },
    { id: 'upz-kr-ulipur', nameEn: 'Ulipur', nameBn: 'উলিপুর' },
    { id: 'upz-kr-nageshwari', nameEn: 'Nageshwari', nameBn: 'নাগেশ্বরী' },
    { id: 'upz-kr-bhurungamari', nameEn: 'Bhurungamari', nameBn: 'ভুরুঙ্গামারী' },
    { id: 'upz-kr-chilmari', nameEn: 'Chilmari', nameBn: 'চিলমারী' },
    { id: 'upz-kr-rajarhat', nameEn: 'Rajarhat', nameBn: 'রাজারহাট' },
    { id: 'upz-kr-phulbari', nameEn: 'Phulbari', nameBn: 'ফুলবাড়ী' },
    { id: 'upz-kr-raomari', nameEn: 'Raomari', nameBn: 'রৌমারী' },
    { id: 'upz-kr-charrajibpur', nameEn: 'Char Rajibpur', nameBn: 'চর রাজিবপুর' }
  ],
  Lalmonirhat: [
    { id: 'upz-lm-sadar', nameEn: 'Lalmonirhat Sadar', nameBn: 'লালমনিরহাট সদর' },
    { id: 'upz-lm-patgram', nameEn: 'Patgram', nameBn: 'পাটগ্রাম' },
    { id: 'upz-lm-hatibandha', nameEn: 'Hatibandha', nameBn: 'হাতীবান্ধা' },
    { id: 'upz-lm-kaliganj', nameEn: 'Kaliganj', nameBn: 'কালীগঞ্জ' },
    { id: 'upz-lm-aditmari', nameEn: 'Aditmari', nameBn: 'আদিতমারী' }
  ],
  Nilphamari: [
    { id: 'upz-nl-sadar', nameEn: 'Nilphamari Sadar', nameBn: 'নীলফামারী সদর' },
    { id: 'upz-nl-saidpur', nameEn: 'Saidpur', nameBn: 'সৈয়দপুর' },
    { id: 'upz-nl-jaldhaka', nameEn: 'Jaldhaka', nameBn: 'জলঢাকা' },
    { id: 'upz-nl-domar', nameEn: 'Domar', nameBn: 'ডোমার' },
    { id: 'upz-nl-dimla', nameEn: 'Dimla', nameBn: 'ডিমলা' },
    { id: 'upz-nl-kishoreganj', nameEn: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ' }
  ],
  Panchagarh: [
    { id: 'upz-pc-sadar', nameEn: 'Panchagarh Sadar', nameBn: 'পঞ্চগড় সদর' },
    { id: 'upz-pc-tetulia', nameEn: 'Tetulia', nameBn: 'তেঁতুলিয়া' },
    { id: 'upz-pc-boda', nameEn: 'Boda', nameBn: 'বোদা' },
    { id: 'upz-pc-debiganj', nameEn: 'Debiganj', nameBn: 'দেবীগঞ্জ' },
    { id: 'upz-pc-atwari', nameEn: 'Atwari', nameBn: 'আটোয়ারী' }
  ],
  Thakurgaon: [
    { id: 'upz-tg-sadar2', nameEn: 'Thakurgaon Sadar', nameBn: 'ঠাকুরগাঁও সদর' },
    { id: 'upz-tg-pirganj2', nameEn: 'Pirganj', nameBn: 'পীরগঞ্জ' },
    { id: 'upz-tg-ranisankail', nameEn: 'Ranisankail', nameBn: 'রাণীশংকৈল' },
    { id: 'upz-tg-baliadangi', nameEn: 'Baliadangi', nameBn: 'বালিয়াডাঙ্গী' },
    { id: 'upz-tg-haripur', nameEn: 'Haripur', nameBn: 'হরিপুর' }
  ],

  // --- MYMENSINGH DIVISION ---
  Mymensingh: [
    { id: 'upz-my-sadar', nameEn: 'Mymensingh Sadar', nameBn: 'ময়মনসিংহ সদর' },
    { id: 'upz-my-trishal', nameEn: 'Trishal', nameBn: 'ত্রিশাল' },
    { id: 'upz-my-bhaluka', nameEn: 'Bhaluka', nameBn: 'ভালুকা' },
    { id: 'upz-my-muktagachha', nameEn: 'Muktagachha', nameBn: 'মুক্তাগাছা' },
    { id: 'upz-my-gaffargaon', nameEn: 'Gaffargaon', nameBn: 'গফরগাঁও' },
    { id: 'upz-my-fulbaria', nameEn: 'Fulbaria', nameBn: 'ফুলবাড়ীয়া' },
    { id: 'upz-my-ishwarganj', nameEn: 'Ishwarganj', nameBn: 'ঈশ্বরগঞ্জ' },
    { id: 'upz-my-nandail', nameEn: 'Nandail', nameBn: 'নান্দাইল' },
    { id: 'upz-my-phulpur', nameEn: 'Phulpur', nameBn: 'ফুলপুর' },
    { id: 'upz-my-gauripur', nameEn: 'Gauripur', nameBn: 'গৌরীপুর' },
    { id: 'upz-my-haluaghat', nameEn: 'Haluaghat', nameBn: 'হালুয়াঘাট' },
    { id: 'upz-my-dhobaura', nameEn: 'Dhobaura', nameBn: 'ধোবাউড়া' },
    { id: 'upz-my-tarakanda', nameEn: 'Tara Khanda', nameBn: 'তারাকান্দা' }
  ],
  Jamalpur: [
    { id: 'upz-jm-sadar', nameEn: 'Jamalpur Sadar', nameBn: 'জামালপুর সদর' },
    { id: 'upz-jm-sarishabari', nameEn: 'Sarishabari', nameBn: 'সরিষাবাড়ী' },
    { id: 'upz-jm-melandaha', nameEn: 'Melandaha', nameBn: 'মেলান্দহ' },
    { id: 'upz-jm-islampur', nameEn: 'Islampur', nameBn: 'ইসলামপুর' },
    { id: 'upz-jm-madarganj', nameEn: 'Madarganj', nameBn: 'মাদারগঞ্জ' },
    { id: 'upz-jm-dewanganj', nameEn: 'Dewanganj', nameBn: 'দেওয়ানগঞ্জ' },
    { id: 'upz-jm-bakshiganj', nameEn: 'Bakshiganj', nameBn: 'বকশীগঞ্জ' }
  ],
  Netrokona: [
    { id: 'upz-nt-sadar2', nameEn: 'Netrokona Sadar', nameBn: 'নেত্রকোণা সদর' },
    { id: 'upz-nt-kendua', nameEn: 'Kendua', nameBn: 'কেন্দুয়া' },
    { id: 'upz-nt-durgapur', nameEn: 'Durgapur', nameBn: 'দুর্গাপুর' },
    { id: 'upz-nt-mobanganj', nameEn: 'Mohanganj', nameBn: 'মোহনগঞ্জ' },
    { id: 'upz-nt-purbadhala', nameEn: 'Purbadhala', nameBn: 'পূর্বধলা' },
    { id: 'upz-nt-barhatta', nameEn: 'Barhatta', nameBn: 'বারহাট্টা' },
    { id: 'upz-nt-kalmakanda', nameEn: 'Kalmakanda', nameBn: 'কলমাকান্দা' },
    { id: 'upz-nt-atpara', nameEn: 'Atpara', nameBn: 'আটপাড়া' },
    { id: 'upz-nt-madan', nameEn: 'Madan', nameBn: 'মদন' },
    { id: 'upz-nt-khaliajuri', nameEn: 'Khaliajuri', nameBn: 'খালিয়াজুড়ী' }
  ],
  Sherpur: [
    { id: 'upz-sh-sadar', nameEn: 'Sherpur Sadar', nameBn: 'শেরপুর সদর' },
    { id: 'upz-sh-nakla', nameEn: 'Nakla', nameBn: 'নকলা' },
    { id: 'upz-sh-nalitabari', nameEn: 'Nalitabari', nameBn: 'নালিতাবাড়ী' },
    { id: 'upz-sh-jhenaigati', nameEn: 'Jhenaigati', nameBn: 'ঝিনাইগাতী' },
    { id: 'upz-sh-sreebardi', nameEn: 'Sreebardi', nameBn: 'শ্রীবরদী' }
  ]
};

/**
 * Get list of districts for a selected division name
 */
export function getDistrictsByDivision(divisionName: string): DistrictEntry[] {
  if (!divisionName) return BANGLADESH_DISTRICTS['Dhaka'] || [];
  return BANGLADESH_DISTRICTS[divisionName] || [];
}

/**
 * Get list of upazilas / thanas for a selected district name
 */
export function getUpazilasByDistrict(districtName: string): LocationEntry[] {
  if (!districtName) return BANGLADESH_UPAZILAS['Dhaka'] || [];
  const found = BANGLADESH_UPAZILAS[districtName];
  if (found && found.length > 0) return found;

  // Fallback default upazilas if district not found
  return [
    { id: `upz-${districtName.toLowerCase()}-sadar`, nameEn: `${districtName} Sadar`, nameBn: `${districtName} সদর` },
    { id: `upz-${districtName.toLowerCase()}-other`, nameEn: 'Other / Thana', nameBn: 'অন্যান্য / থানা' }
  ];
}

/**
 * Get all 64 districts in a flat list
 */
export function getAllDistricts(): DistrictEntry[] {
  return Object.values(BANGLADESH_DISTRICTS).flat();
}
