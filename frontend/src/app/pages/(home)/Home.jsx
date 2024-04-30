import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import { Suspense, useState, useContext, useEffect, useRef, lazy } from "react";
import { useNavigate } from "react-router-dom";

import useDocumentTitle from '@/app/hooks/useDocumentTitle' // Custom hooks

import { Post, Get, splitPostcode } from '@/app/lib/utils' // Common functions

import heroPhotoOfWoman from '@/app/assets/img-hero-page.jpg'

import ChildrenCareSvg from '@/app/assets/Vertical_Childcare.svg'
import ElderlyCareSvg from '@/app/assets/Vertical_Senior_Care.svg'
import PetCareSvg from '@/app/assets/Vertical_Pet_Care.svg'

import { Button } from '@/app/components/ui/button'
import { BsSearch } from "react-icons/bs";

import { Card, CardContent } from "@/app/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/app/components/ui/carousel"

import { AspectRatio } from "@/app/components/ui/aspect-ratio"
import { ScrollArea, ScrollBar } from "@/app/components/ui/scroll-area";

const Alertbox = lazy(() => import('@/app/components/custom/Alertbox'));

const buttons = [
    { name: "Child Care", icon: ChildrenCareSvg, option: "option_childcare" },
    { name: "Elderly Care", icon: ElderlyCareSvg, option: "option_seniorcare" },
    { name: "Pet Care", icon: PetCareSvg, option: "option_petcare" }
]

import PagesData from "@/app/data/PagesData";

import { useUser, useAuth } from "@clerk/clerk-react";

const Home = () => {
    useDocumentTitle('Home');
    const navigate = useNavigate();

    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();

    const [searchingPostCode, setSearchingPostCode] = useState(false);
    const [addresses, setAddresses] = useState({});

    const searchPostCodeRef = useRef();

    const grabPostCode = () => {
        const postCodes = document.querySelectorAll('#searchPostCode');

        postCodes.forEach((postCode) => {
            if (postCode.value.length > 0) {
                searchPostCodeRef.current = postCode;
            }
        })

        return searchPostCodeRef.current;
    }

    const handlePostCodeSearch = async (e) => {
        e.preventDefault();

        // if (user && isSignedIn) {
        //     navigate('/job-listings');
        //     return
        // }

        if (searchingPostCode) return;

        const searchPostCode = grabPostCode();

        if (!searchPostCodeRef.current.value) {
            if (addresses && addresses.length > 0) {
                setAddresses([]);
            }

            return;
        };

        const postCode = searchPostCodeRef.current.value;
        const postCodeLastPart = splitPostcode(postCode);

        const response = await Get('https://api.postcodes.io/postcodes?query=' + postCode);
        const data = await response.json();

        if (!data.result) {
            setSearchingPostCode(false);
            return;
        }

        if (data.result.length > 0) {
            data.result = data.result.slice(0, 5);

            data.result = data.result.map((address) => {
                const { postcode, postal_town, country, region, admin_ward } = address;
                const addressPostCodeLastPart = splitPostcode(postcode);

                if ((postCodeLastPart && postCodeLastPart.incode) && (addressPostCodeLastPart && addressPostCodeLastPart.incode)) {

                    if (postCodeLastPart === addressPostCodeLastPart) {
                        return {
                            post_code: postcode,
                            postal_town: postal_town,
                            country: country,
                            region: region,
                            formatted_address: admin_ward
                        }
                    };
                }

                return {
                    post_code: postcode,
                    postal_town: postal_town,
                    country: country,
                    region: region,
                    formatted_address: admin_ward
                }
            }
            )
        }

        setAddresses(data.result);
        setSearchingPostCode(false);
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
        const searchPostCode = grabPostCode();

        if (searchPostCodeRef.current.value) {
            options.postCode = searchPostCodeRef.current.value;
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
        const searchPostCode = grabPostCode();

        if (searchPostCodeRef.current.value) {
            options.postCode = searchPostCodeRef.current.value;
        }

        options.preferences = 'option_helper';

        setFormData(options);
        navigate('/signup')
    }

    const handleLocation = (e, postCode) => {
        e.preventDefault();

        searchPostCodeRef.current.value = postCode;

        setAddresses([]);
    }

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
                    pauseOnFocusLoss
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
                                                <label
                                                    onChange={(e) => {
                                                        if (searchingPostCode) return;
                                                        setTimeout(() => handlePostCodeSearch(e), 1000)
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (searchingPostCode) return;

                                                        e.key === 'Enter' && handlePostCodeSearch(e)
                                                    }}
                                                    className='flex items-center text-slate-600 w-full h-full focus-within:outline-none hover:cursor-text'>

                                                    <input type='text' id='searchPostCode' className='w-[95%] outline-none bg-inherit mx-5' placeholder='Type a post code' />

                                                    <Button
                                                        onClick={(e) => {
                                                            if (searchingPostCode) return;

                                                            handlePostCodeSearch(e)
                                                        }}
                                                        disabled={searchingPostCode}
                                                        className='mr-5 bg-inherit hover:bg-inherit'> <BsSearch size={20} color="black" />
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
                                            <h1 className='text-xs'>This is a simple page with a hero image</h1>
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
                                            <label
                                                onChange={(e) => {
                                                    if (searchingPostCode) return;

                                                    setTimeout(() => handlePostCodeSearch(e), 1000)
                                                }}
                                                onKeyDown={(e) => {
                                                    if (searchingPostCode) return;

                                                    e.key === 'Enter' && handlePostCodeSearch(e)
                                                }}
                                                className='flex items-center text-slate-600 w-full h-full focus-within:outline-none hover:cursor-text'>

                                                <input type='text' id='searchPostCode' className='w-[95%] outline-none bg-inherit mx-5' placeholder='Type a post code' />

                                                <Button
                                                    onClick={(e) => {
                                                        if (searchingPostCode) return;

                                                        handlePostCodeSearch(e)
                                                    }}
                                                    disabled={searchingPostCode}
                                                    className='mr-5 bg-inherit hover:bg-inherit'> <BsSearch size={20} color="black" />
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
                                        <h1 className='text-xs'>This is a simple page with a hero image</h1>
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
                                            <CardContent className="flex aspect-square items-center justify-center max-sm:items-start max-sm:justify-start max-md:size-27 max-sm:w-[4rem] max-sm:h-[12rem] max-extraSm:w-[2rem] max-extraSm:h-[10rem] lg:px-1 lg:pt-12 lg:pb-16 max-lg:p-2 max-md:-m-7 max-sm:m-3 max-extraSm:p-0 hover:cursor-grab">
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

                    <div className="my-5 bg-orange-400 bg-opacity-15 p-5 lg:rounded-3xl max-lg:w-[calc(100dvw-15px)] lg:w-[1200px] h-[150px]">
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