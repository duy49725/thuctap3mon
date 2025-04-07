import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { app } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import { loginGoogle } from '@/store/auth/auth-slice';
import { Button } from '../ui/button';
import { AiFillGoogleCircle } from 'react-icons/ai';


const OAuth = () => {
    const auth = getAuth(app);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const {toast} = useToast();
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({prompt: 'select_account'});
        try{
            const resultFormGoogle = await signInWithPopup(auth, provider);
            dispatch(loginGoogle({
                fullName: resultFormGoogle.user.displayName,
                email: resultFormGoogle.user.email,
                avatar: resultFormGoogle.user.photoURL
            })).then((data) => {
                if(data?.payload?.success){
                    toast({
                        title: data?.payload?.data
                    });
                    navigate('/shopping/home')
                }else{
                    toast({
                        title: data?.payload?.message,
                        variant: "destructive"
                    })
                }
            })
        }catch(error){
            console.log(error);
        }
    }
    return (
        <Button type='button' onClick={handleGoogleClick} className='w-full hover:bg-slate-500 hover:text-slate-900'>
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            Continue with Google
        </Button>
    )
}

export default OAuth;