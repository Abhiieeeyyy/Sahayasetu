import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://lftospgdzrwkvhbalkti.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdG9zcGdkenJ3a3ZoYmFsa3RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MzEzNzUsImV4cCI6MjEwNDUwNzM3NX0.WxodujO6OixJlZTTGl6l_FlbJkKCm-3HuNq5gJ265B8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const DISTRICTS_METADATA = [
  {
    code: 'KL-WYD-2024',
    name: 'Wayanad',
    calamity: 'Landslide',
    calamityTitle: 'Chooralmala & Meppadi Massive Landslide',
    camps: [
      'Meppadi GHSS Relief Camp',
      'Chooralmala Town Hall Camp',
      'Mundakkai Community Shelter',
      'Kalpetta SKMJ High School Camp'
    ],
    jobId: 'JOB-WYD-101',
    people: [
      { name: 'Suresh Kumar M.', phone: '9447102144', aadhaarLast: '4912', ration: 'KL-WYD-7819201', skills: ['Masonry', 'General Civil Labor'], exp: 8, wage: 950, status: 'Available', bio: true },
      { name: 'Geetha Balakrishnan', phone: '9447218902', aadhaarLast: '3821', ration: 'KL-WYD-6721094', skills: ['General Civil Labor'], exp: 4, wage: 800, status: 'Available', bio: true },
      { name: 'Vijayan K. P.', phone: '9446114520', aadhaarLast: '8710', ration: 'KL-WYD-8823190', skills: ['Carpentry', 'Roofing'], exp: 12, wage: 950, status: 'Assigned', bio: true },
      { name: 'Muhammed Shafi', phone: '9447339011', aadhaarLast: '1192', ration: 'KL-WYD-3401928', skills: ['Electrical'], exp: 6, wage: 1050, status: 'Available', bio: true },
      { name: 'Anoop Chandran', phone: '9446882301', aadhaarLast: '6543', ration: 'KL-WYD-9102834', skills: ['Plumbing', 'General Civil Labor'], exp: 5, wage: 850, status: 'In-Review', bio: false },
      { name: 'Marykutty George', phone: '9447001923', aadhaarLast: '2398', ration: 'KL-WYD-5501928', skills: ['General Civil Labor'], exp: 3, wage: 800, status: 'Available', bio: true },
      { name: 'Manoj Varghese', phone: '9446771092', aadhaarLast: '9012', ration: 'KL-WYD-4491029', skills: ['Heavy Machinery', 'General Civil Labor'], exp: 9, wage: 1050, status: 'Assigned', bio: true },
      { name: 'Sunitha Babu', phone: '9447558190', aadhaarLast: '7721', ration: 'KL-WYD-6601923', skills: ['Roofing'], exp: 4, wage: 850, status: 'Available', bio: true },
      { name: 'Ratheesh K.', phone: '9446993412', aadhaarLast: '4456', ration: 'KL-WYD-7719283', skills: ['Steel Fixing', 'Masonry'], exp: 7, wage: 900, status: 'Available', bio: true },
      { name: 'Biju Thomas', phone: '9447881029', aadhaarLast: '5567', ration: 'KL-WYD-8819203', skills: ['Masonry'], exp: 10, wage: 950, status: 'Available', bio: true },
      { name: 'Priya Rajendran', phone: '9446332104', aadhaarLast: '3345', ration: 'KL-WYD-2201948', skills: ['General Civil Labor'], exp: 2, wage: 750, status: 'Resting', bio: true },
      { name: 'Jayanandan P. V.', phone: '9447120934', aadhaarLast: '8891', ration: 'KL-WYD-1192834', skills: ['Carpentry'], exp: 11, wage: 950, status: 'Available', bio: true }
    ]
  },
  {
    code: 'KL-KKD-2024',
    name: 'Kozhikode',
    calamity: 'Flood',
    calamityTitle: 'Chaliyar River Basin Deluge & Coastal Surge',
    camps: [
      'Beypore Fisheries School Relief Camp',
      'Feroke Higher Secondary School',
      'Kadalundi Community Hall Camp',
      'Mavoor St. Marys School Shelter'
    ],
    jobId: 'JOB-KKD-201',
    people: [
      { name: 'Ashraf Ali K.', phone: '9447221094', aadhaarLast: '5123', ration: 'KL-KKD-8910234', skills: ['Masonry', 'General Civil Labor'], exp: 9, wage: 900, status: 'Available', bio: true },
      { name: 'Sreedharan Nair', phone: '9446110945', aadhaarLast: '6612', ration: 'KL-KKD-7819203', skills: ['Carpentry'], exp: 14, wage: 950, status: 'Available', bio: true },
      { name: 'Fathima Zahra', phone: '9447338102', aadhaarLast: '2234', ration: 'KL-KKD-4501923', skills: ['General Civil Labor'], exp: 4, wage: 800, status: 'Available', bio: true },
      { name: 'Shibu Kumar T.', phone: '9446889012', aadhaarLast: '7789', ration: 'KL-KKD-3390192', skills: ['Plumbing'], exp: 7, wage: 880, status: 'Assigned', bio: true },
      { name: 'Abdul Majeed', phone: '9447551029', aadhaarLast: '9901', ration: 'KL-KKD-9901823', skills: ['Electrical'], exp: 8, wage: 1000, status: 'Available', bio: true },
      { name: 'Lekha Pradeep', phone: '9446992014', aadhaarLast: '4412', ration: 'KL-KKD-1102938', skills: ['General Civil Labor'], exp: 3, wage: 750, status: 'In-Review', bio: false },
      { name: 'Naveen Das', phone: '9447118934', aadhaarLast: '3356', ration: 'KL-KKD-6671029', skills: ['Steel Fixing', 'Masonry'], exp: 6, wage: 920, status: 'Available', bio: true },
      { name: 'Roshni Moideen', phone: '9446774512', aadhaarLast: '8876', ration: 'KL-KKD-5540192', skills: ['General Civil Labor'], exp: 5, wage: 850, status: 'Available', bio: true },
      { name: 'Prasad M. V.', phone: '9447441098', aadhaarLast: '1145', ration: 'KL-KKD-7789012', skills: ['Heavy Machinery'], exp: 10, wage: 1050, status: 'Assigned', bio: true },
      { name: 'Sajeevan K.', phone: '9446559023', aadhaarLast: '6634', ration: 'KL-KKD-2234501', skills: ['Roofing', 'Carpentry'], exp: 8, wage: 900, status: 'Available', bio: true },
      { name: 'Zainaba Beevi', phone: '9447990123', aadhaarLast: '9945', ration: 'KL-KKD-8890123', skills: ['General Civil Labor'], exp: 2, wage: 750, status: 'Available', bio: true },
      { name: 'Haridasan Nair', phone: '9446221890', aadhaarLast: '4489', ration: 'KL-KKD-4412093', skills: ['Masonry'], exp: 12, wage: 950, status: 'Available', bio: true }
    ]
  },
  {
    code: 'KL-IDK-2024',
    name: 'Idukki',
    calamity: 'Landslide',
    calamityTitle: 'Devikulam & Munnar Hill Range Mudslides',
    camps: [
      'Munnar Govt High School Camp',
      'Devikulam St. Jude Hall',
      'Peerumade Tea Estate Camp',
      'Udumbanchola Town Shelter'
    ],
    jobId: 'JOB-IDK-301',
    people: [
      { name: 'Mathew Joseph', phone: '9446077312', aadhaarLast: '7102', ration: 'KL-IDK-8819203', skills: ['Heavy Machinery', 'General Civil Labor'], exp: 11, wage: 1000, status: 'Assigned', bio: true },
      { name: 'Selvi Murugan', phone: '9447192834', aadhaarLast: '4451', ration: 'KL-IDK-3349012', skills: ['General Civil Labor'], exp: 6, wage: 800, status: 'Available', bio: true },
      { name: 'Ramaswamy P.', phone: '9446881920', aadhaarLast: '9912', ration: 'KL-IDK-7719284', skills: ['Masonry', 'Steel Fixing'], exp: 8, wage: 900, status: 'Available', bio: true },
      { name: 'Ancy Varghese', phone: '9447552093', aadhaarLast: '3341', ration: 'KL-IDK-5501928', skills: ['General Civil Labor'], exp: 3, wage: 750, status: 'Available', bio: true },
      { name: 'Jojo Augustine', phone: '9446991045', aadhaarLast: '8823', ration: 'KL-IDK-2239014', skills: ['Carpentry', 'Roofing'], exp: 9, wage: 950, status: 'Available', bio: true },
      { name: 'Palaniswamy K.', phone: '9447334512', aadhaarLast: '5561', ration: 'KL-IDK-6671029', skills: ['General Civil Labor'], exp: 12, wage: 850, status: 'Available', bio: true },
      { name: 'Shaji Thomas', phone: '9446119028', aadhaarLast: '1190', ration: 'KL-IDK-4491023', skills: ['Electrical'], exp: 7, wage: 1000, status: 'Available', bio: true },
      { name: 'Molly Chacko', phone: '9447883419', aadhaarLast: '6678', ration: 'KL-IDK-9901824', skills: ['General Civil Labor'], exp: 4, wage: 800, status: 'In-Review', bio: false },
      { name: 'Karthik Raja', phone: '9446551209', aadhaarLast: '2289', ration: 'KL-IDK-1192830', skills: ['Plumbing', 'General Civil Labor'], exp: 5, wage: 880, status: 'Available', bio: true },
      { name: 'Babu Kurian', phone: '9447228901', aadhaarLast: '7745', ration: 'KL-IDK-7789014', skills: ['Masonry'], exp: 13, wage: 950, status: 'Available', bio: true },
      { name: 'Saraswathi Amma', phone: '9446779014', aadhaarLast: '4410', ration: 'KL-IDK-3301928', skills: ['General Civil Labor'], exp: 2, wage: 750, status: 'Resting', bio: true },
      { name: 'Georgekutty P. J.', phone: '9447443109', aadhaarLast: '9956', ration: 'KL-IDK-5540198', skills: ['Heavy Machinery'], exp: 15, wage: 1100, status: 'Assigned', bio: true }
    ]
  },
  {
    code: 'KL-ALP-2024',
    name: 'Alappuzha',
    calamity: 'Flood',
    calamityTitle: 'Kuttanad Polder Breach & Deep Waterlogging',
    camps: [
      'Champakulam Govt UP School Camp',
      'Nedumudi Community Relief Centre',
      'Edathua St. Aloysius Hall',
      'Kuttanad Polder Evacuation Shelter'
    ],
    jobId: 'JOB-ALP-401',
    people: [
      { name: 'Soman Pillai K.', phone: '9447366120', aadhaarLast: '6123', ration: 'KL-ALP-8910245', skills: ['General Civil Labor', 'Roofing'], exp: 10, wage: 850, status: 'Available', bio: true },
      { name: 'Omana Kunjumon', phone: '9446118945', aadhaarLast: '8821', ration: 'KL-ALP-7819214', skills: ['General Civil Labor'], exp: 5, wage: 800, status: 'Available', bio: true },
      { name: 'Kalesh Kumar P.', phone: '9447229014', aadhaarLast: '3341', ration: 'KL-ALP-4501934', skills: ['Masonry', 'General Civil Labor'], exp: 8, wage: 920, status: 'Assigned', bio: true },
      { name: 'Rajan Achary', phone: '9446884512', aadhaarLast: '7790', ration: 'KL-ALP-3390198', skills: ['Carpentry'], exp: 15, wage: 950, status: 'Available', bio: true },
      { name: 'Bindu Sudhakaran', phone: '9447559028', aadhaarLast: '1145', ration: 'KL-ALP-9901834', skills: ['General Civil Labor'], exp: 4, wage: 750, status: 'Available', bio: true },
      { name: 'Sunny Joseph', phone: '9446991204', aadhaarLast: '5567', ration: 'KL-ALP-1102948', skills: ['Plumbing', 'Electrical'], exp: 7, wage: 950, status: 'Available', bio: true },
      { name: 'Pradeep Kumar', phone: '9447113409', aadhaarLast: '9902', ration: 'KL-ALP-6671039', skills: ['Steel Fixing'], exp: 6, wage: 900, status: 'Available', bio: true },
      { name: 'Sudha Madhavan', phone: '9446778901', aadhaarLast: '4432', ration: 'KL-ALP-5540199', skills: ['General Civil Labor'], exp: 3, wage: 750, status: 'In-Review', bio: false },
      { name: 'Venu Gopal K.', phone: '9447445612', aadhaarLast: '8876', ration: 'KL-ALP-7789023', skills: ['Roofing', 'Masonry'], exp: 9, wage: 920, status: 'Assigned', bio: true },
      { name: 'Maniyan Pillai', phone: '9446552309', aadhaarLast: '2234', ration: 'KL-ALP-2234512', skills: ['General Civil Labor'], exp: 12, wage: 850, status: 'Available', bio: true },
      { name: 'Shainy Thomas', phone: '9447994510', aadhaarLast: '6689', ration: 'KL-ALP-8890134', skills: ['General Civil Labor'], exp: 2, wage: 750, status: 'Available', bio: true },
      { name: 'Gopinathan Nair', phone: '9446227801', aadhaarLast: '1156', ration: 'KL-ALP-4412098', skills: ['Carpentry'], exp: 16, wage: 950, status: 'Available', bio: true }
    ]
  },
  {
    code: 'KL-EKM-2024',
    name: 'Ernakulam',
    calamity: 'Flood',
    calamityTitle: 'Periyar River Overflow & Urban Lowland Inundation',
    camps: [
      'Aluva St. Xavier Relief Camp',
      'Eloor Municipal Town Hall',
      'North Paravur Govt High School',
      'Kalamassery Community Centre'
    ],
    jobId: 'JOB-EKM-501',
    people: [
      { name: 'Priya R. Varma', phone: '9447412055', aadhaarLast: '4192', ration: 'KL-EKM-8819205', skills: ['General Civil Labor'], exp: 4, wage: 800, status: 'Available', bio: true },
      { name: 'Antony Dsouza', phone: '9446113456', aadhaarLast: '8812', ration: 'KL-EKM-7719285', skills: ['Plumbing', 'General Civil Labor'], exp: 9, wage: 880, status: 'Assigned', bio: true },
      { name: 'Subair K. M.', phone: '9447228912', aadhaarLast: '3349', ration: 'KL-EKM-3349015', skills: ['Electrical'], exp: 8, wage: 1050, status: 'Available', bio: true },
      { name: 'Lakshmi Narayanan', phone: '9446887890', aadhaarLast: '7721', ration: 'KL-EKM-5501929', skills: ['General Civil Labor'], exp: 3, wage: 750, status: 'Available', bio: true },
      { name: 'Biju Paul', phone: '9447554512', aadhaarLast: '1198', ration: 'KL-EKM-2239015', skills: ['Masonry'], exp: 11, wage: 950, status: 'Available', bio: true },
      { name: 'Shailaja Mohan', phone: '9446993410', aadhaarLast: '6654', ration: 'KL-EKM-6671030', skills: ['General Civil Labor'], exp: 5, wage: 800, status: 'In-Review', bio: false },
      { name: 'Rony Sebastian', phone: '9447119023', aadhaarLast: '2287', ration: 'KL-EKM-4491025', skills: ['Steel Fixing', 'Masonry'], exp: 7, wage: 920, status: 'Available', bio: true },
      { name: 'Nisha V. K.', phone: '9446771289', aadhaarLast: '9901', ration: 'KL-EKM-9901825', skills: ['General Civil Labor'], exp: 2, wage: 750, status: 'Available', bio: true },
      { name: 'Gireesh Kumar', phone: '9447448901', aadhaarLast: '5543', ration: 'KL-EKM-1192831', skills: ['Carpentry'], exp: 10, wage: 950, status: 'Available', bio: true },
      { name: 'Francis Xavier', phone: '9446554510', aadhaarLast: '8876', ration: 'KL-EKM-7789015', skills: ['Plumbing'], exp: 6, wage: 880, status: 'Assigned', bio: true },
      { name: 'Beena Suresh', phone: '9447991204', aadhaarLast: '3312', ration: 'KL-EKM-3301929', skills: ['General Civil Labor'], exp: 4, wage: 800, status: 'Available', bio: true },
      { name: 'Abdul Kareem', phone: '9446229034', aadhaarLast: '7765', ration: 'KL-EKM-5540199', skills: ['Heavy Machinery'], exp: 12, wage: 1050, status: 'Available', bio: true }
    ]
  },
  {
    code: 'KL-TCR-2024',
    name: 'Thrissur',
    calamity: 'Flood',
    calamityTitle: 'Chalakudy River Catchment Surge & Kole Wetland Breach',
    camps: [
      'Chalakudy Sacred Heart Camp',
      'Mala Community Hall Shelter',
      'Kodungallur Town Hall Camp',
      'Peringalkuthu Relief Centre'
    ],
    jobId: 'JOB-TCR-601',
    people: [
      { name: 'Suresh Kurup', phone: '9447588910', aadhaarLast: '3390', ration: 'KL-TCR-8910246', skills: ['Masonry', 'Steel Fixing'], exp: 10, wage: 920, status: 'Available', bio: true },
      { name: 'Vasantha Kumari', phone: '9446114590', aadhaarLast: '7712', ration: 'KL-TCR-7819215', skills: ['General Civil Labor'], exp: 4, wage: 800, status: 'Available', bio: true },
      { name: 'Davis Porathur', phone: '9447223401', aadhaarLast: '2289', ration: 'KL-TCR-4501935', skills: ['Carpentry'], exp: 13, wage: 950, status: 'Assigned', bio: true },
      { name: 'Unnikrishnan P.', phone: '9446889023', aadhaarLast: '6651', ration: 'KL-TCR-3390199', skills: ['Electrical'], exp: 7, wage: 1000, status: 'Available', bio: true },
      { name: 'Lissy Varghese', phone: '9447551289', aadhaarLast: '1143', ration: 'KL-TCR-9901835', skills: ['General Civil Labor'], exp: 5, wage: 800, status: 'In-Review', bio: false },
      { name: 'Mohanan C. K.', phone: '9446994512', aadhaarLast: '5590', ration: 'KL-TCR-1102949', skills: ['Masonry'], exp: 11, wage: 920, status: 'Available', bio: true },
      { name: 'Rajesh Menon', phone: '9447118902', aadhaarLast: '9923', ration: 'KL-TCR-6671040', skills: ['Plumbing', 'General Civil Labor'], exp: 6, wage: 850, status: 'Available', bio: true },
      { name: 'Radhika Sreenath', phone: '9446772301', aadhaarLast: '4487', ration: 'KL-TCR-5540200', skills: ['General Civil Labor'], exp: 3, wage: 750, status: 'Available', bio: true },
      { name: 'Joy Antony', phone: '9447449012', aadhaarLast: '8834', ration: 'KL-TCR-7789024', skills: ['Steel Fixing'], exp: 8, wage: 920, status: 'Assigned', bio: true },
      { name: 'Sankaran Namboothiri', phone: '9446557890', aadhaarLast: '2219', ration: 'KL-TCR-2234513', skills: ['Carpentry', 'Roofing'], exp: 15, wage: 950, status: 'Available', bio: true },
      { name: 'Sheela Jayaraj', phone: '9447992301', aadhaarLast: '6674', ration: 'KL-TCR-8890135', skills: ['General Civil Labor'], exp: 2, wage: 750, status: 'Available', bio: true },
      { name: 'Praveen K. R.', phone: '9446224510', aadhaarLast: '1132', ration: 'KL-TCR-4412099', skills: ['Heavy Machinery'], exp: 9, wage: 1050, status: 'Available', bio: true }
    ]
  },
  {
    code: 'KL-PLK-2024',
    name: 'Palakkad',
    calamity: 'Flood',
    calamityTitle: 'Attappadi Valley Hill Torrents & Bhavani River Flooding',
    camps: [
      'Agali Tribal Community Hall Camp',
      'Sholayur Forest Relief Shelter',
      'Mannarkkad Govt High School',
      'Attappadi Valley Relief Camp'
    ],
    jobId: 'JOB-PLK-701',
    people: [
      { name: 'Haridasan G.', phone: '9446633189', aadhaarLast: '6644', ration: 'KL-PLK-8819206', skills: ['Carpentry', 'Roofing'], exp: 11, wage: 900, status: 'Available', bio: true },
      { name: 'Valli Maruthan', phone: '9447118940', aadhaarLast: '1192', ration: 'KL-PLK-7719286', skills: ['General Civil Labor'], exp: 6, wage: 800, status: 'Available', bio: true },
      { name: 'Chinnaswamy K.', phone: '9446229014', aadhaarLast: '5563', ration: 'KL-PLK-3349016', skills: ['Roofing', 'General Civil Labor'], exp: 9, wage: 900, status: 'Assigned', bio: true },
      { name: 'Shantha Kumar', phone: '9447884512', aadhaarLast: '9904', ration: 'KL-PLK-5501930', skills: ['General Civil Labor'], exp: 4, wage: 750, status: 'Available', bio: true },
      { name: 'Murugesan R.', phone: '9446551289', aadhaarLast: '3348', ration: 'KL-PLK-2239016', skills: ['Masonry'], exp: 12, wage: 920, status: 'Available', bio: true },
      { name: 'Devaki Amma', phone: '9447993410', aadhaarLast: '7781', ration: 'KL-PLK-6671031', skills: ['General Civil Labor'], exp: 3, wage: 750, status: 'In-Review', bio: false },
      { name: 'Rangarajan P.', phone: '9446119023', aadhaarLast: '2247', ration: 'KL-PLK-4491026', skills: ['Carpentry'], exp: 8, wage: 900, status: 'Assigned', bio: true },
      { name: 'Meenakshi Sundaram', phone: '9447771289', aadhaarLast: '8865', ration: 'KL-PLK-9901826', skills: ['General Civil Labor'], exp: 5, wage: 800, status: 'Available', bio: true },
      { name: 'Balakrishnan Nair', phone: '9446448901', aadhaarLast: '4419', ration: 'KL-PLK-1192832', skills: ['Electrical'], exp: 7, wage: 1000, status: 'Available', bio: true },
      { name: 'Raju G.', phone: '9447554510', aadhaarLast: '9983', ration: 'KL-PLK-7789016', skills: ['Plumbing'], exp: 6, wage: 880, status: 'Available', bio: true },
      { name: 'Kalyaniamma', phone: '9446991204', aadhaarLast: '3321', ration: 'KL-PLK-3301930', skills: ['General Civil Labor'], exp: 2, wage: 750, status: 'Resting', bio: true },
      { name: 'Krishnankutty K.', phone: '9447229034', aadhaarLast: '6675', ration: 'KL-PLK-5540201', skills: ['Masonry', 'General Civil Labor'], exp: 10, wage: 900, status: 'Available', bio: true }
    ]
  },
  {
    code: 'KL-MPM-2024',
    name: 'Malappuram',
    calamity: 'Flood',
    calamityTitle: 'Nilambur Forest Foothill Deluge & Chaliyar Surge',
    camps: [
      'Nilambur Govt Model HSS Camp',
      'Mampad Community Hall Camp',
      'Edavanna Relief Shelter',
      'Vazhakkad PWD Rest Camp'
    ],
    jobId: 'JOB-MPM-801',
    people: [
      { name: 'Abdul Rasheed M.', phone: '9447799021', aadhaarLast: '1198', ration: 'KL-MPM-8910247', skills: ['Plumbing', 'General Civil Labor'], exp: 9, wage: 890, status: 'Available', bio: true },
      { name: 'Sainaba Koya', phone: '9446112345', aadhaarLast: '5561', ration: 'KL-MPM-7819216', skills: ['General Civil Labor'], exp: 5, wage: 800, status: 'Available', bio: true },
      { name: 'Moideen Kutty P.', phone: '9447227890', aadhaarLast: '9903', ration: 'KL-MPM-4501936', skills: ['Plumbing'], exp: 8, wage: 890, status: 'Assigned', bio: true },
      { name: 'Hamza V. P.', phone: '9446884519', aadhaarLast: '3347', ration: 'KL-MPM-3390200', skills: ['Electrical'], exp: 11, wage: 1050, status: 'Available', bio: true },
      { name: 'Rasiya Begum', phone: '9447559012', aadhaarLast: '7783', ration: 'KL-MPM-9901836', skills: ['General Civil Labor'], exp: 3, wage: 750, status: 'Available', bio: true },
      { name: 'Koya Thangal', phone: '9446991289', aadhaarLast: '2215', ration: 'KL-MPM-1102950', skills: ['Masonry'], exp: 13, wage: 920, status: 'Available', bio: true },
      { name: 'Faisal Babu', phone: '9447114510', aadhaarLast: '6679', ration: 'KL-MPM-6671041', skills: ['Carpentry'], exp: 7, wage: 950, status: 'Available', bio: true },
      { name: 'Asiya Ummer', phone: '9446779023', aadhaarLast: '1148', ration: 'KL-MPM-5540201', skills: ['General Civil Labor'], exp: 4, wage: 800, status: 'In-Review', bio: false },
      { name: 'Sujith Kumar', phone: '9447441209', aadhaarLast: '5594', ration: 'KL-MPM-7789025', skills: ['Heavy Machinery'], exp: 10, wage: 1050, status: 'Assigned', bio: true },
      { name: 'Yousuf Ali', phone: '9446558901', aadhaarLast: '9932', ration: 'KL-MPM-2234514', skills: ['Steel Fixing'], exp: 6, wage: 900, status: 'Available', bio: true },
      { name: 'Subaida Beevi', phone: '9447993412', aadhaarLast: '4478', ration: 'KL-MPM-8890136', skills: ['General Civil Labor'], exp: 2, wage: 750, status: 'Available', bio: true },
      { name: 'Mujeeb Rahman', phone: '9446227894', aadhaarLast: '8821', ration: 'KL-MPM-4412100', skills: ['Masonry', 'Plumbing'], exp: 12, wage: 920, status: 'Available', bio: true }
    ]
  },
  {
    code: 'KL-KNR-2024',
    name: 'Kannur',
    calamity: 'Landslide',
    calamityTitle: 'Iritty Mountain Stream Flash Flood & Mudslides',
    camps: [
      'Iritty St. Thomas HSS Camp',
      'Sreekandapuram Community Camp',
      'Kelakam Panchayat Hall Shelter',
      'Peravoor Govt UP School Camp'
    ],
    jobId: 'JOB-KNR-901',
    people: [
      { name: 'Vijayan T. K.', phone: '9447855432', aadhaarLast: '4482', ration: 'KL-KNR-8819207', skills: ['General Civil Labor', 'Masonry'], exp: 10, wage: 870, status: 'Available', bio: true },
      { name: 'Padmini Narayanan', phone: '9446119045', aadhaarLast: '8814', ration: 'KL-KNR-7719287', skills: ['General Civil Labor'], exp: 5, wage: 800, status: 'Available', bio: true },
      { name: 'Dinesh Babu P.', phone: '9447224519', aadhaarLast: '2249', ration: 'KL-KNR-3349017', skills: ['Masonry'], exp: 9, wage: 900, status: 'Assigned', bio: true },
      { name: 'Pavithran K.', phone: '9446881289', aadhaarLast: '6681', ration: 'KL-KNR-5501931', skills: ['Carpentry'], exp: 14, wage: 950, status: 'Available', bio: true },
      { name: 'Shobha Gangadharan', phone: '9447557890', aadhaarLast: '1138', ration: 'KL-KNR-2239017', skills: ['General Civil Labor'], exp: 4, wage: 750, status: 'Available', bio: true },
      { name: 'Santhosh Kumar', phone: '9446992301', aadhaarLast: '5576', ration: 'KL-KNR-6671032', skills: ['Electrical'], exp: 8, wage: 1000, status: 'Available', bio: true },
      { name: 'Raveendran M.', phone: '9447118912', aadhaarLast: '9921', ration: 'KL-KNR-4491027', skills: ['Plumbing', 'General Civil Labor'], exp: 7, wage: 850, status: 'Available', bio: true },
      { name: 'Vasanthi K. P.', phone: '9446774510', aadhaarLast: '4467', ration: 'KL-KNR-9901827', skills: ['General Civil Labor'], exp: 3, wage: 750, status: 'In-Review', bio: false },
      { name: 'Sudheesh C.', phone: '9447449023', aadhaarLast: '8852', ration: 'KL-KNR-1192833', skills: ['Steel Fixing'], exp: 6, wage: 900, status: 'Available', bio: true },
      { name: 'Gangadharan Nair', phone: '9446551290', aadhaarLast: '3398', ration: 'KL-KNR-7789017', skills: ['General Civil Labor'], exp: 11, wage: 850, status: 'Assigned', bio: true },
      { name: 'Kousalya Amma', phone: '9447997801', aadhaarLast: '7741', ration: 'KL-KNR-3301931', skills: ['General Civil Labor'], exp: 2, wage: 750, status: 'Resting', bio: true },
      { name: 'Madhavan V. V.', phone: '9446223456', aadhaarLast: '2214', ration: 'KL-KNR-5540202', skills: ['Masonry', 'Roofing'], exp: 12, wage: 920, status: 'Available', bio: true }
    ]
  },
  {
    code: 'KL-KSD-2024',
    name: 'Kasaragod',
    calamity: 'Flood',
    calamityTitle: 'Chandragiri Basin Monsoon Surge & Soil Piping Erosion',
    camps: [
      'Bekal Beach Community Hall Camp',
      'Vellarikundu Hill Relief Camp',
      'Hosdurg Govt School Shelter',
      'Manjeshwar Community Center'
    ],
    jobId: 'JOB-KSD-001',
    people: [
      { name: 'Radhakrishna Rao B.', phone: '9446911840', aadhaarLast: '7719', ration: 'KL-KSD-8910248', skills: ['Heavy Machinery', 'Steel Fixing'], exp: 12, wage: 980, status: 'Available', bio: true },
      { name: 'Leelavathi Shenoy', phone: '9447113456', aadhaarLast: '2283', ration: 'KL-KSD-7819217', skills: ['General Civil Labor'], exp: 5, wage: 800, status: 'Available', bio: true },
      { name: 'Mahabala Bhat', phone: '9446227890', aadhaarLast: '6649', ration: 'KL-KSD-4501937', skills: ['Masonry'], exp: 10, wage: 920, status: 'Assigned', bio: true },
      { name: 'Ibrahim Khalil', phone: '9447881209', aadhaarLast: '1175', ration: 'KL-KSD-3390201', skills: ['Steel Fixing'], exp: 7, wage: 900, status: 'Available', bio: true },
      { name: 'Sujatha Kamath', phone: '9446559023', aadhaarLast: '5539', ration: 'KL-KSD-9901837', skills: ['General Civil Labor'], exp: 3, wage: 750, status: 'Available', bio: true },
      { name: 'Poovappa Poojary', phone: '9447991289', aadhaarLast: '9963', ration: 'KL-KSD-1102951', skills: ['Carpentry'], exp: 13, wage: 950, status: 'Available', bio: true },
      { name: 'Yashodha Rai', phone: '9446114510', aadhaarLast: '4428', ration: 'KL-KSD-6671042', skills: ['General Civil Labor'], exp: 4, wage: 750, status: 'In-Review', bio: false },
      { name: 'Damodaran Master', phone: '9447779023', aadhaarLast: '8892', ration: 'KL-KSD-5540202', skills: ['Electrical'], exp: 8, wage: 1000, status: 'Available', bio: true },
      { name: 'Ananda Naik', phone: '9446441209', aadhaarLast: '3357', ration: 'KL-KSD-7789026', skills: ['Heavy Machinery'], exp: 11, wage: 1050, status: 'Assigned', bio: true },
      { name: 'Rukmini Karanth', phone: '9447558901', aadhaarLast: '7723', ration: 'KL-KSD-2234515', skills: ['General Civil Labor'], exp: 6, wage: 800, status: 'Available', bio: true },
      { name: 'Sanjeeva Alva', phone: '9446993412', aadhaarLast: '2281', ration: 'KL-KSD-8890137', skills: ['Plumbing'], exp: 9, wage: 880, status: 'Available', bio: true },
      { name: 'Chandrashekara Shetty', phone: '9447227894', aadhaarLast: '6648', ration: 'KL-KSD-4412101', skills: ['Masonry', 'Roofing'], exp: 14, wage: 950, status: 'Available', bio: true }
    ]
  },
  {
    code: 'KL-KTM-2024',
    name: 'Kottayam',
    calamity: 'Flood',
    calamityTitle: 'Meenachil River Submersion & Pala Lowland Floods',
    camps: [
      'Pala St. Thomas College Hall Camp',
      'Erattupetta Govt High School',
      'Kumarakom Relief Shelter',
      'Vaikom Municipal Town Hall'
    ],
    jobId: 'JOB-KTM-501',
    people: [
      { name: 'Mary Joseph', phone: '9447044512', aadhaarLast: '2267', ration: 'KL-KTM-8819208', skills: ['General Civil Labor', 'Plumbing'], exp: 8, wage: 860, status: 'Available', bio: true },
      { name: 'Kuriakose Thomas', phone: '9446118912', aadhaarLast: '7714', ration: 'KL-KTM-7719288', skills: ['Masonry'], exp: 12, wage: 920, status: 'Assigned', bio: true },
      { name: 'Annamma Philip', phone: '9447223456', aadhaarLast: '1183', ration: 'KL-KTM-3349018', skills: ['General Civil Labor'], exp: 4, wage: 750, status: 'Available', bio: true },
      { name: 'Mathew Luke', phone: '9446889045', aadhaarLast: '5549', ration: 'KL-KTM-5501932', skills: ['Carpentry'], exp: 10, wage: 950, status: 'Available', bio: true },
      { name: 'Raji Radhakrishnan', phone: '9447551209', aadhaarLast: '9927', ration: 'KL-KTM-2239018', skills: ['General Civil Labor'], exp: 3, wage: 750, status: 'In-Review', bio: false },
      { name: 'Tomy Mathew', phone: '9446994519', aadhaarLast: '4461', ration: 'KL-KTM-6671033', skills: ['Plumbing'], exp: 7, wage: 880, status: 'Assigned', bio: true },
      { name: 'Reji Varghese', phone: '9447117890', aadhaarLast: '8839', ration: 'KL-KTM-4491028', skills: ['Electrical'], exp: 9, wage: 1000, status: 'Available', bio: true },
      { name: 'Thankamma Jacob', phone: '9446772345', aadhaarLast: '3372', ration: 'KL-KTM-9901828', skills: ['General Civil Labor'], exp: 5, wage: 800, status: 'Available', bio: true },
      { name: 'Saji Abraham', phone: '9447448912', aadhaarLast: '7748', ration: 'KL-KTM-1192834', skills: ['Roofing', 'Carpentry'], exp: 11, wage: 950, status: 'Available', bio: true },
      { name: 'Jose Chacko', phone: '9446554590', aadhaarLast: '2291', ration: 'KL-KTM-7789018', skills: ['General Civil Labor'], exp: 6, wage: 850, status: 'Available', bio: true },
      { name: 'Sindhu Mohandas', phone: '9447991280', aadhaarLast: '6653', ration: 'KL-KTM-3301932', skills: ['General Civil Labor'], exp: 2, wage: 750, status: 'Resting', bio: true },
      { name: 'Georgekutty Mani', phone: '9446229045', aadhaarLast: '1128', ration: 'KL-KTM-5540203', skills: ['Heavy Machinery'], exp: 13, wage: 1050, status: 'Available', bio: true }
    ]
  },
  {
    code: 'KL-PTA-2024',
    name: 'Pathanamthitta',
    calamity: 'Flood',
    calamityTitle: 'Pampa & Achankovil River Overflow Flash Flooding',
    camps: [
      'Ranni St. Thomas School Camp',
      'Kozhencherry Community Centre',
      'Pandalam Town Hall Shelter',
      'Mallappally Govt Boys School'
    ],
    jobId: 'JOB-PTA-601',
    people: [
      { name: 'George Koshy', phone: '9446188204', aadhaarLast: '9935', ration: 'KL-PTA-8910249', skills: ['Masonry', 'General Civil Labor'], exp: 11, wage: 910, status: 'Available', bio: true },
      { name: 'Amini Varghese', phone: '9447114590', aadhaarLast: '4481', ration: 'KL-PTA-7819218', skills: ['General Civil Labor'], exp: 5, wage: 800, status: 'Available', bio: true },
      { name: 'Binu Mathew', phone: '9446228912', aadhaarLast: '8857', ration: 'KL-PTA-4501938', skills: ['Masonry'], exp: 8, wage: 910, status: 'Assigned', bio: true },
      { name: 'Kochumon P.', phone: '9447883456', aadhaarLast: '3329', ration: 'KL-PTA-3390202', skills: ['Carpentry'], exp: 14, wage: 950, status: 'Available', bio: true },
      { name: 'Leelamma Daniel', phone: '9446559045', aadhaarLast: '7793', ration: 'KL-PTA-9901838', skills: ['General Civil Labor'], exp: 3, wage: 750, status: 'In-Review', bio: false },
      { name: 'Sunil Kumar C.', phone: '9447991209', aadhaarLast: '2268', ration: 'KL-PTA-1102952', skills: ['Electrical'], exp: 9, wage: 1050, status: 'Available', bio: true },
      { name: 'Jacob Philip', phone: '9446117890', aadhaarLast: '6635', ration: 'KL-PTA-6671043', skills: ['Plumbing'], exp: 6, wage: 880, status: 'Available', bio: true },
      { name: 'Saramma Varkey', phone: '9447772345', aadhaarLast: '1182', ration: 'KL-PTA-5540203', skills: ['General Civil Labor'], exp: 4, wage: 800, status: 'Available', bio: true },
      { name: 'Rajan Achankunju', phone: '9446448912', aadhaarLast: '5547', ration: 'KL-PTA-7789027', skills: ['Steel Fixing'], exp: 10, wage: 920, status: 'Assigned', bio: true },
      { name: 'Vilasini Nair', phone: '9447554590', aadhaarLast: '9913', ration: 'KL-PTA-2234516', skills: ['General Civil Labor'], exp: 2, wage: 750, status: 'Available', bio: true },
      { name: 'Titus Thomas', phone: '9446991280', aadhaarLast: '4479', ration: 'KL-PTA-8890138', skills: ['Heavy Machinery'], exp: 12, wage: 1050, status: 'Available', bio: true },
      { name: 'Kunjappan Nair', phone: '9447229045', aadhaarLast: '8831', ration: 'KL-PTA-4412102', skills: ['Roofing', 'Masonry'], exp: 13, wage: 920, status: 'Available', bio: true }
    ]
  },
  {
    code: 'KL-KLM-2024',
    name: 'Kollam',
    calamity: 'Flood',
    calamityTitle: 'Ashtamudi Estuary Overflow & Coastal Sea Surge',
    camps: [
      'Mundakkal Beach Relief Camp',
      'Karunagappally Govt Model School',
      'Paravur SN Hall Camp',
      'Sasthamcotta Community Hall'
    ],
    jobId: 'JOB-KLM-701',
    people: [
      { name: 'Sreekumar N.', phone: '9447922340', aadhaarLast: '5541', ration: 'KL-KLM-8819209', skills: ['General Civil Labor', 'Steel Fixing'], exp: 9, wage: 880, status: 'Available', bio: true },
      { name: 'Laila Beevi', phone: '9446114512', aadhaarLast: '9918', ration: 'KL-KLM-7719289', skills: ['General Civil Labor'], exp: 4, wage: 800, status: 'Available', bio: true },
      { name: 'Christudas J.', phone: '9447228945', aadhaarLast: '3374', ration: 'KL-KLM-3349019', skills: ['Steel Fixing'], exp: 8, wage: 900, status: 'Assigned', bio: true },
      { name: 'Harikumar Pillai', phone: '9446883456', aadhaarLast: '7749', ration: 'KL-KLM-5501933', skills: ['Carpentry'], exp: 13, wage: 950, status: 'Available', bio: true },
      { name: 'Shobhana Kumari', phone: '9447559012', aadhaarLast: '2218', ration: 'KL-PTA-2239019', skills: ['General Civil Labor'], exp: 5, wage: 750, status: 'In-Review', bio: false },
      { name: 'Sudheer Babu', phone: '9446991209', aadhaarLast: '6685', ration: 'KL-KLM-6671034', skills: ['Electrical'], exp: 7, wage: 1000, status: 'Available', bio: true },
      { name: 'Antony Peter', phone: '9447117890', aadhaarLast: '1152', ration: 'KL-KLM-4491029', skills: ['Plumbing', 'General Civil Labor'], exp: 6, wage: 850, status: 'Available', bio: true },
      { name: 'Santha Madhavan', phone: '9446772345', aadhaarLast: '5598', ration: 'KL-KLM-9901829', skills: ['General Civil Labor'], exp: 3, wage: 750, status: 'Available', bio: true },
      { name: 'Mohanan Pillai', phone: '9447448912', aadhaarLast: '9964', ration: 'KL-KLM-1192835', skills: ['Masonry'], exp: 11, wage: 920, status: 'Available', bio: true },
      { name: 'Sebastian Fernandez', phone: '9446554590', aadhaarLast: '4431', ration: 'KL-KLM-7789019', skills: ['General Civil Labor'], exp: 7, wage: 880, status: 'Assigned', bio: true },
      { name: 'Radhamani Amma', phone: '9447991280', aadhaarLast: '8875', ration: 'KL-KLM-3301933', skills: ['General Civil Labor'], exp: 2, wage: 750, status: 'Resting', bio: true },
      { name: 'Biju V. S.', phone: '9446229045', aadhaarLast: '3342', ration: 'KL-KLM-5540204', skills: ['Heavy Machinery'], exp: 10, wage: 1050, status: 'Available', bio: true }
    ]
  },
  {
    code: 'KL-TVM-2024',
    name: 'Thiruvananthapuram',
    calamity: 'Cyclone',
    calamityTitle: 'Vamanapuram River Breach & Coastal Erosion Surge',
    camps: [
      'Valiathura Fisheries School Camp',
      'Vizhinjam Harbour Community Centre',
      'Nedumangad Town Hall Shelter',
      'Attingal Govt Model School Camp'
    ],
    jobId: 'JOB-TVM-801',
    people: [
      { name: 'Lakshmi Nair', phone: '9446577198', aadhaarLast: '1102', ration: 'KL-TVM-8910250', skills: ['General Civil Labor'], exp: 5, wage: 870, status: 'Available', bio: true },
      { name: 'Silvester Pereira', phone: '9447118945', aadhaarLast: '5568', ration: 'KL-TVM-7819219', skills: ['General Civil Labor'], exp: 8, wage: 870, status: 'Assigned', bio: true },
      { name: 'Manoharan Pillai', phone: '9446223409', aadhaarLast: '9924', ration: 'KL-TVM-4501939', skills: ['Masonry'], exp: 14, wage: 950, status: 'Available', bio: true },
      { name: 'Anitha Kumari', phone: '9447889012', aadhaarLast: '4480', ration: 'KL-TVM-3390203', skills: ['General Civil Labor'], exp: 4, wage: 750, status: 'Available', bio: true },
      { name: 'Cleetus Dsouza', phone: '9446551280', aadhaarLast: '8846', ration: 'KL-TVM-9901839', skills: ['Carpentry'], exp: 11, wage: 950, status: 'Available', bio: true },
      { name: 'Gopakumar K.', phone: '9447994519', aadhaarLast: '3318', ration: 'KL-TVM-1102953', skills: ['Electrical'], exp: 9, wage: 1050, status: 'Available', bio: true },
      { name: 'Stella Mary', phone: '9446112345', aadhaarLast: '7774', ration: 'KL-TVM-6671044', skills: ['General Civil Labor'], exp: 3, wage: 750, status: 'In-Review', bio: false },
      { name: 'Sukumaran Nair', phone: '9447778901', aadhaarLast: '2241', ration: 'KL-TVM-5540204', skills: ['Plumbing'], exp: 8, wage: 880, status: 'Available', bio: true },
      { name: 'Nelson Xavier', phone: '9446445612', aadhaarLast: '6697', ration: 'KL-TVM-7789028', skills: ['Steel Fixing'], exp: 7, wage: 900, status: 'Available', bio: true },
      { name: 'Padmakumari', phone: '9447552309', aadhaarLast: '1153', ration: 'KL-TVM-2234517', skills: ['General Civil Labor'], exp: 6, wage: 800, status: 'Available', bio: true },
      { name: 'Kishore Kumar', phone: '9446997890', aadhaarLast: '5529', ration: 'KL-TVM-8890139', skills: ['Heavy Machinery'], exp: 10, wage: 1050, status: 'Assigned', bio: true },
      { name: 'Bhaskaran Pillai', phone: '9447224510', aadhaarLast: '9984', ration: 'KL-TVM-4412103', skills: ['Roofing', 'Masonry'], exp: 15, wage: 920, status: 'Available', bio: true }
    ]
  }
];

async function seed() {
  console.log('Starting seed generation for 14 Kerala districts (12 users per district = 168 users)...');

  const allUsers = [];
  const sqlInserts = [];

  DISTRICTS_METADATA.forEach((district) => {
    district.people.forEach((p, index) => {
      const idxStr = String(index + 1).padStart(3, '0');
      const districtShort = district.code.split('-')[1];
      const id = `BEN-${districtShort}-${idxStr}`;
      const camp = district.camps[index % district.camps.length];
      const email = `${p.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.${districtShort.toLowerCase()}@keralarelief.gov.in`;

      const livingStatuses = ['Relief Camp', 'Makeshift', 'Host Family', 'Permanent Repaired'];
      const livingStatus = livingStatuses[index % livingStatuses.length];

      const userRecord = {
        id,
        auth_user_id: null,
        name: p.name,
        email,
        phone: p.phone,
        aadhaar_masked: `•••• •••• ${p.aadhaarLast}`,
        ration_card_no: p.ration,
        district_id: district.code,
        region_id: district.code,
        district_name: district.name,
        camp_name: camp,
        family_members_count: (index % 4) + 1,
        calamity: district.calamity,
        skills: p.skills,
        experience_years: p.exp,
        living_status: livingStatus,
        daily_wage_tier: p.wage,
        is_medical_fit: index !== 10, // 1 resting user per district
        is_bio_verified: p.bio,
        placement_status: p.status,
        assigned_project_id: p.status === 'Assigned' ? district.jobId : null,
        emergency_contact: `9447${Math.floor(100000 + Math.random() * 900000)}`,
        bank_account_dbt: {
          account: `SBIN${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          ifsc: `SBIN007${Math.floor(100 + Math.random() * 900)}`,
          dbt_linked: p.bio,
          state: 'Kerala',
          district: district.name,
          job_priorities: p.skills,
          relationship: 'Self',
          avatar_url: '',
          aadhaar_raw: `9842${Math.floor(1000 + Math.random() * 9000)}${p.aadhaarLast}`,
          calamity_title: district.calamityTitle
        },
        created_at: new Date(Date.now() - (index * 86400000 * 2)).toISOString(),
        updated_at: new Date().toISOString()
      };

      allUsers.push(userRecord);

      // Prepare SQL snippet
      const skillsSql = `ARRAY[${p.skills.map(s => `'${s}'`).join(', ')}]`;
      const bankJsonStr = JSON.stringify(userRecord.bank_account_dbt).replace(/'/g, "''");
      const assignedSql = userRecord.assigned_project_id ? `'${userRecord.assigned_project_id}'` : 'NULL';
      const rationSql = `'${userRecord.ration_card_no}'`;
      
      sqlInserts.push(`('${userRecord.id}', NULL, '${userRecord.name.replace(/'/g, "''")}', '${userRecord.email}', '${userRecord.phone}', '${userRecord.aadhaar_masked}', ${rationSql}, '${userRecord.district_id}', '${userRecord.region_id}', '${userRecord.district_name}', '${userRecord.camp_name.replace(/'/g, "''")}', ${userRecord.family_members_count}, '${userRecord.calamity}', ${skillsSql}, ${userRecord.experience_years}, '${userRecord.living_status}', ${userRecord.daily_wage_tier}, ${userRecord.is_medical_fit}, ${userRecord.is_bio_verified}, '${userRecord.placement_status}', ${assignedSql}, '${userRecord.emergency_contact}', '${bankJsonStr}'::jsonb)`);
    });
  });

  console.log(`Prepared ${allUsers.length} user records across 14 districts.`);

  // Batch insert to Supabase in chunks of 50
  const CHUNK_SIZE = 50;
  for (let i = 0; i < allUsers.length; i += CHUNK_SIZE) {
    const chunk = allUsers.slice(i, i + CHUNK_SIZE);
    console.log(`Upserting chunk ${i / CHUNK_SIZE + 1} (${chunk.length} users)...`);
    const { error } = await supabase.from('users').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error(`Error in chunk ${i / CHUNK_SIZE + 1}:`, error);
      process.exit(1);
    }
  }

  console.log('All 168 user records successfully seeded into Supabase database!');

  // Verify total count in Supabase
  const { count, error: countErr } = await supabase.from('users').select('*', { count: 'exact', head: true });
  console.log('Total verified users in Supabase database:', count, 'Count Error:', countErr);

  // Append seed data to supabase/schema.sql
  const schemaPath = 'supabase/schema.sql';
  let schemaContent = fs.readFileSync(schemaPath, 'utf-8');

  // Check if seed data section already exists
  const seedMarker = '-- ============================================================================\n-- 6. SEED DATA: 10-15 CITIZEN USERS PER DISTRICT (168 USERS TOTAL)\n-- ============================================================================';
  
  const sqlStatement = `\n${seedMarker}\nINSERT INTO public.users (\n    id, auth_user_id, name, email, phone, aadhaar_masked, ration_card_no, district_id, region_id, district_name, camp_name, family_members_count, calamity, skills, experience_years, living_status, daily_wage_tier, is_medical_fit, is_bio_verified, placement_status, assigned_project_id, emergency_contact, bank_account_dbt\n) VALUES\n${sqlInserts.join(',\n')}\nON CONFLICT (id) DO UPDATE SET\n    name = EXCLUDED.name,\n    email = EXCLUDED.email,\n    phone = EXCLUDED.phone,\n    district_id = EXCLUDED.district_id,\n    region_id = EXCLUDED.region_id,\n    district_name = EXCLUDED.district_name,\n    camp_name = EXCLUDED.camp_name,\n    skills = EXCLUDED.skills,\n    experience_years = EXCLUDED.experience_years,\n    living_status = EXCLUDED.living_status,\n    daily_wage_tier = EXCLUDED.daily_wage_tier,\n    placement_status = EXCLUDED.placement_status,\n    assigned_project_id = EXCLUDED.assigned_project_id;\n`;

  if (schemaContent.includes('6. SEED DATA: 10-15 CITIZEN USERS')) {
    console.log('Updating existing seed section in schema.sql...');
    const parts = schemaContent.split(seedMarker);
    schemaContent = parts[0] + sqlStatement;
  } else {
    console.log('Appending seed section to schema.sql...');
    schemaContent += sqlStatement;
  }

  fs.writeFileSync(schemaPath, schemaContent, 'utf-8');
  console.log('supabase/schema.sql updated with complete 168 user seed statements!');
}

seed().catch(err => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
