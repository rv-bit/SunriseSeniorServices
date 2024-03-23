import { useNavigate } from 'react-router-dom';

import { Button } from '@/app/components/ui/button';

import HappyMissionFamily from '@/app/assets/img-about-happy_family.jpg';
import BusinessFounding from '@/app/assets/img-about-business-idea.jpg';

import PagesData from '@/app/data/PagesData';

const About = () => {
    const navigate = useNavigate();

    return (
        <section className='flex items-center justify-center min-h-5 mr-5 my-10 w-full h-full'>

            <div className='grid grid-flow-row min-w:[1000px] max-w-full w-2/5 lg:h-3/4 xl:w-3/4 max-2xl:w-3/4 2xl:w-3/5 max-3xl:w-1/2 3xl:w-[50%] max-xl:w-3/4 max-lg:w-[90%] h-full gap-20'>
                <div className='flex items-center justify-center max-lg:justify-start max-lg:items-start text-left gap-5'>
                    <img src={HappyMissionFamily} alt='Happy Family' className='max-lg:hidden max-lg:size-[550px] lg:w-1/2 max-2xl:w-1/2 2xl:w-1/4 rounded-xl' style={{clipPath: 'polygon(50% 0%, 0% 50%, 250% 400%)'}} />

                    <div className='w-1/2 max-lg:w-full'>
                        <div className='flex flex-col gap-5 items-start justify-start'>
                            <h1 className='text-5xl font-bold'>Mission</h1>

                            <p className='text-lg font-medium'>{PagesData.About.mission}</p>
                        </div>
                    </div>
                </div>


                <div className='flex items-center justify-center max-lg:justify-start max-lg:items-start max-lg:text-left text-center gap-20'>
                    
                    <div className='w-1/2 max-lg:w-full'>
                        <div className='flex flex-col gap-5 items-center justify-center max-lg:justify-start max-lg:items-start'>
                            <h1 className='text-5xl font-bold'>Our Full Story</h1>
                            <p className='text-lg font-medium'>{PagesData.About.what_we_do_all}</p>
                        </div>
                    </div>
                    
                    <img src={BusinessFounding} alt='Business Founding' className='max-lg:hidden max-lg:size-[550px] lg:w-1/2 max-2xl:w-1/2 2xl:w-1/4 rounded-xl' style={{clipPath: 'polygon(50% 0%, 83% 9%, 99% 69%, 90% 99%, 28% 100%, 0 87%, 6% 13%)'}} />
                </div>

                <div className='flex items-center justify-center'>
                    <Button onClick={() => navigate('/contact')} className='w-1/2 mb-5'>Contact Us</Button>
                </div>
            </div>

        </section>
    )
}

export default About