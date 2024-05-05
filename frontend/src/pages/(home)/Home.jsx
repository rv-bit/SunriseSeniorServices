import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { Suspense, useState, useContext, useEffect, useRef, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";

import useDocumentTitle from '@/hooks/useDocumentTitle' // Custom hooks
import { Post, Get, getAddresses } from '@/lib/utils' // Common functions

import heroPhotoOfWoman from '@/assets/img-hero-page.jpg'
import ChildrenCareSvg from '@/assets/Vertical_Childcare.svg'
import ElderlyCareSvg from '@/assets/Vertical_Senior_Care.svg'
import PetCareSvg from '@/assets/Vertical_Pet_Care.svg'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { Search } from "lucide-react";

const Alertbox = lazy(() => import('@/components/custom/Alertbox'));

const buttons = [
    { name: "Child Care", icon: ChildrenCareSvg, option: "option_childcare" },
    { name: "Elderly Care", icon: ElderlyCareSvg, option: "option_seniorcare" },
    { name: "Pet Care", icon: PetCareSvg, option: "option_petcare" }
]

import PagesData from "@/data/PagesData";

const Home = () => {
    useDocumentTitle('Home');
    const navigate = useNavigate();

    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();

    const [searchingPostCode, setSearchingPostCode] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [searchPostCode, setSearchPostCode] = useState('');

    const handleInputChange = (e) => {
        const value = e.target.value.trim();
        setSearchPostCode(value);
    };

    const handleLocation = (e, postCode) => {
        e.preventDefault();

        handleSearchListingForPostCode(e);
        setAddresses([]);
    }

    const handleSearchListingForPostCode = async (e) => {
        e.preventDefault();

        if (searchingPostCode) return;

        if (!searchPostCode || searchPostCode.length === 0) {
            toast.error('Please provide a post code');
            return;
        }

        if (searchPostCode.length < 5) {
            toast.error('Post code must be at least 5 characters');
            return;
        }

        if (searchPostCode.length > 8) {
            toast.error('Post code must be at most 8 characters');
            return;
        }

        if (user && isSignedIn) {
            const newValue = searchPostCode.replace(' ', '');
            navigate(`/job-listings/?location=${newValue}`,);
            return
        }

        navigate('/signup');
    }

    const [alertDialog, setAlertDialog] = useState({
        message: '',
        open: false,
    });

    const [formData, setFormData] = useState({});
    const handleAlertDialog = (message) => {
        setAlertDialog({ ...alertDialog, open: true, message: message });
    }

    const handleAlertDialogClose = () => {
        setAlertDialog({ ...alertDialog, open: false });

        setFormData({ ...formData, option: 'option_requester' });
    }

    const handleAlertDialogSubmit = () => {
        setAlertDialog({ ...alertDialog, open: false });

        setFormData({ ...formData, option: 'option_helper' });
    }

    const handleCarouselClick = (option) => {
        if (user && isSignedIn) {
            navigate('/job-listings');
            return
        }

        handleAlertDialog('Are you a carer or a person seeking care?');

        const options = {}
        if (searchPostCode && searchPostCode.length > 0) {
            options.postCode = searchPostCode;
        }

        options.preferences = option;

        setFormData(options);
    }

    const handleJoinAsCarer = () => {
        if (user && isSignedIn) {
            navigate('/job-listings');
            return
        }

        const options = {}
        if (searchPostCode && searchPostCode.length > 0) {
            options.postCode = searchPostCode;
        }

        options.preferences = 'option_helper';

        setFormData(options);
        navigate('/signup')
    }

    useEffect(() => {
        const handleSearchAddresses = async () => {
            if (!searchPostCode || searchPostCode.length === 0) {
                if (addresses && addresses.length > 0) {
                    setAddresses([]);
                    setSearchPostCode('');
                }

                setSearchingPostCode(false);
                return;
            };

            setSearchingPostCode(true);

            var newAddresses = await getAddresses(searchPostCode);

            setAddresses(newAddresses);
            setSearchingPostCode(false);
        }

        handleSearchAddresses();
        return () => { }
    }, [searchPostCode]);

    useEffect(() => {
        if (!alertDialog.open) {
            if (formData === undefined || formData === null || Object.keys(formData).length === 0) return;

            navigate('/signup')
        }

        return () => {
            setFormData({});
        }
    }, [isLoaded, isSignedIn, alertDialog.open]);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                    <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-gray-200"></div>
                    <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-blue-500 animate-spin">
                    </div>
                </div>
            </div>
        }>
            <section className='flex items-center justify-center min-h-5 mx-5'>
                {alertDialog.open && (
                    <Alertbox
                        Title="Join as Carer"
                        Description={alertDialog.message}
                        onSubmit={handleAlertDialogSubmit}
                        onCancel={handleAlertDialogClose}
                        button={{ second: "Requester", main: "Carer" }}
                    />
                )}

                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    limit={3}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover
                    theme="light"
                    stacked={true}
                />

                <div className='flex flex-col items-center justify-center w-full'>
                    <div className='flex items-center justify-center w-full'>

                        <div className="w-auto h-auto hidden max-md:flex flex-col col-span-2 items-center justify-center z-20">
                            <div className='flex items-center justify-center w-full relative'>
                                <img src={heroPhotoOfWoman} alt='Home' className="object-cover max-lg:h-[400px] w-full rounded-3xl" />

                                <div className="absolute w-full h-full shadow-2xl"></div>
                            </div>

                            <div className="w-full h-[350px] -mt-20 rounded-2xl bg-[#eeb89c] shadow-xl drop-shadow-2xl">
                                <div className='flex items-center justify-center h-full w-full'>

                                    <div className='flex flex-col items-start justify-center w-full h-full py-20 px-10 gap-5'>
                                        <h1 className='text-start text-xl font-bold'>Find trusted locals for your every need</h1>

                                        <div className="flex flex-col items-start justify-center gap-2">
                                            <div className='flex flex-col items-center justify-center w-full border-slate-600 rounded-lg h-[60px] shadow-2xl bg-slate-200 mb-2'>
                                                <label className='flex items-center text-slate-600 w-full h-full focus-within:outline-none hover:cursor-text'>

                                                    <input
                                                        value={searchPostCode}
                                                        onChange={handleInputChange}
                                                        onKeyDown={(e) => {
                                                            if (searchingPostCode) return;
                                                            e.key === 'Enter' && handleInputChange(e)
                                                        }}
                                                        type='text'
                                                        className='w-[95%] outline-none bg-inherit mx-5'
                                                        placeholder='Type a post code'
                                                    />

                                                    <Button
                                                        onClick={(e) => {
                                                            if (searchingPostCode) return;

                                                            handleSearchListingForPostCode(e)
                                                        }}
                                                        disabled={searchingPostCode}
                                                        className='mr-5 bg-inherit hover:bg-inherit'> <Search size={20} color="black" />
                                                    </Button>
                                                </label>

                                                {addresses && addresses.length > 0 && (
                                                    <div className="w-[285px] max-extraSm:w-full h-auto max-h-[300px] bg-slate-100 rounded-lg absolute top-[15.5rem] max-extraSm:mx-5">
                                                        <ScrollArea className="w-full h-full">
                                                            {addresses.map((address, index) => {
                                                                const { post_code, postal_town, formatted_address } = address;

                                                                return (
                                                                    <div key={index} className="flex items-center justify-center w-full h-12 hover:bg-slate-200 rounded-lg mb-2 px-2 last:mb-0">
                                                                        <button className="text-center" onClick={(e) => handleLocation(e, post_code)}>{post_code} - {formatted_address}</button>
                                                                    </div>
                                                                )
                                                            })}

                                                            <ScrollBar orientation="vertical" className="absolute inset-y-0 right-0 bg-slate-200 rounded-lg" />
                                                        </ScrollArea>
                                                    </div>
                                                )}
                                            </div>
                                            <h1 className='text-xs'></h1>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="w-[1200px] h-[350px] max-md:hidden block max-md:bottom-16 rounded-2xl bg-[#eeb89c] shadow-xl drop-shadow-2xl z-20">
                            <div className='flex items-center justify-center h-full w-full'>
                                <div className='flex flex-col items-start justify-center w-1/2 h-full py-20 px-10 gap-5'>
                                    <h1 className='text-start text-4xl font-bold'>Find trusted locals for your every need</h1>

                                    <div className="flex flex-col items-start justify-center gap-2">
                                        <div className='flex flex-col items-center justify-center w-full border-slate-600 rounded-lg h-[60px] shadow-2xl bg-slate-200 mb-2'>
                                            <label className='flex items-center text-slate-600 w-full h-full focus-within:outline-none hover:cursor-text'>

                                                <input
                                                    value={searchPostCode}
                                                    onChange={handleInputChange}
                                                    onKeyDown={(e) => {
                                                        if (searchingPostCode) return;
                                                        e.key === 'Enter' && handleInputChange(e)
                                                    }}
                                                    type='text'
                                                    className='w-[95%] outline-none bg-inherit mx-5'
                                                    placeholder='Type a post code'
                                                />

                                                <Button
                                                    onClick={(e) => {
                                                        if (searchingPostCode) return;

                                                        handleSearchListingForPostCode(e)
                                                    }}
                                                    disabled={searchingPostCode}
                                                    className='mr-5 bg-inherit hover:bg-inherit'> <Search size={20} color="black" />
                                                </Button>

                                            </label>

                                            {addresses && addresses.length > 0 && (
                                                <div className="w-[285px] h-auto max-h-[300px] bg-slate-100 rounded-lg absolute top-[15.5rem]">
                                                    <ScrollArea className="w-full h-full">
                                                        {addresses.map((address, index) => {
                                                            const { post_code, postal_town, formatted_address } = address;

                                                            return (
                                                                <div key={index} className="flex items-center justify-center w-full h-12 hover:bg-slate-200 rounded-lg mb-2 px-2 last:mb-0">
                                                                    <button className="text-center" onClick={(e) => handleLocation(e, post_code)}>{post_code} - {formatted_address}</button>
                                                                </div>
                                                            )
                                                        })}

                                                        <ScrollBar orientation="vertical" className="absolute inset-y-0 right-0 bg-slate-200 rounded-lg" />
                                                    </ScrollArea>
                                                </div>
                                            )}
                                        </div>
                                        <h1 className='text-xs'></h1>
                                    </div>
                                </div>

                                <div className='max-md:hidden flex flex-col items-center justify-end w-1/2 h-full gap-1 relative overflow-hidden rounded-e-xl'>
                                    <img src={heroPhotoOfWoman} alt='Home' className="object-cover max-lg:h-[400px]" />

                                    {/* Looks like a separator, cuts the image ina diagonal way */}
                                    <div className="absolute left-0 w-full h-full" style={{ background: 'linear-gradient(100deg, #eeb89c 10%, transparent 35%)' }}></div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="flex items-center justify-center mt-20 z-10"
                    >
                        <CarouselContent className="">
                            {buttons.map((button, index) => {
                                const { name, icon, option } = button;

                                return (
                                    <CarouselItem key={index} className="basis-1/3 max-md:basis-1/2 max-sm:basis-11/12">
                                        <Card>
                                            <CardContent
                                                onClick={() => handleCarouselClick(option)}
                                                className="flex aspect-square items-center justify-center size-30 lg:p-10 p-16 max-sm:p-3 max-md:p-10 max-extraSm:p-1 hover:cursor-pointer hover:bg-slate-200 hover:bg-opacity-25">

                                                <div className="flex flex-col justify-center items-center gap-2 h-full max-lg:w-full w-[150px]">
                                                    <img src={icon} alt={name} className="size-20" />
                                                    <h1 className="text-xl font-semibold">{name}</h1>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                );
                            })}

                        </CarouselContent>

                        <CarouselPrevious className="max-md:hidden lg:flex" />
                        <CarouselNext className="max-md:hidden lg:flex" />
                    </Carousel>

                    <h1 className="my-5 text-center">Move with finger or mouse <span className="underline">Left</span> and <span className="underline">Right</span> on top of buttons</h1>
                    <h1 className="mt-5 text-2xl max-sm:text-lg font-semibold">MEET THE TEAM</h1>

                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="flex items-center justify-center my-5 w-full"
                    >
                        <CarouselContent>
                            {PagesData.Team.map((button, index) => {
                                const { name, from, role, message } = button;
                                const nameInitials = name.split(' ').map((n) => n[0]).join('');

                                return (
                                    <CarouselItem key={index} className="basis-1/3 max-md:basis-1/2 max-sm:basis-11/12">
                                        <Card>
                                            <CardContent className="flex aspect-square items-center justify-center max-sm:items-start max-sm:justify-start max-md:size-27 max-sm:w-full  max-sm:h-[12rem] max-extraSm:h-[10rem] lg:px-1 lg:pt-12 lg:pb-16 max-lg:p-2 max-md:-m-7 max-sm:m-3 max-extraSm:p-0 hover:cursor-grab">
                                                <div className="flex flex-col justify-center items-center max-sm:items-start max-sm:justify-start gap-2 h-full w-[90%] max-sm:w-[300px]">

                                                    <div className="max-sm:hidden contents">
                                                        <div className="flex items-start justify-start mb-2">
                                                            <div className='size-[55px] rounded-full bg-muted flex-shrink-0 text-black flex justify-center items-center'>{nameInitials}</div>
                                                        </div>

                                                        <div className="flex items-start justify-center w-1/2 text-center">
                                                            <h1 className="line-clamp-2 text-sm font-bold">{message}</h1>
                                                        </div>

                                                        <div className="flex items-end justify-end mt-20">
                                                            <h1 className="text-sm font-semibold overflow-hidden">{name} &bull; {role} &bull; <span>{from}</span></h1>
                                                        </div>
                                                    </div>

                                                    <div className="max-sm:contents hidden">
                                                        <div className="flex items-start justify-start mb-5">
                                                            <div className='size-[55px] rounded-full bg-muted flex-shrink-0 text-black flex justify-center items-center'>{nameInitials}</div>
                                                        </div>

                                                        <div className="flex items-start justify-center w-4/5 text-center">
                                                            <h1 className="line-clamp-2 text-ellipsis whitespace-nowrap text-sm font-bold overflow-hidden">{message}</h1>
                                                        </div>
                                                        <h1 className="text-sm font-semibold">{name} &bull; {role} &bull; <span>{from}</span></h1>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>

                        <CarouselPrevious className="hidden" />
                        <CarouselNext className="hidden" />
                    </Carousel>

                    <div className="my-5 bg-orange-400 bg-opacity-15 p-5 lg:rounded-3xl max-lg:w-dvw lg:w-[1200px] h-auto">
                        <h1 className="text-2xl font-semibold text-center">Are you a <span className=" text-orange-500">Carer?</span></h1>
                        <h1 className="text-center">Join our team and start earning today!</h1>

                        <div className="flex items-center justify-center mt-5">
                            <Button onClick={handleJoinAsCarer} className="bg-orange-500 hover:bg-orange-600">Join Us</Button>
                        </div>
                    </div>
                </div>
            </section>
        </Suspense >
    );
}

export default Home;