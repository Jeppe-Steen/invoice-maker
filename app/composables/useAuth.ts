export const useAuth = () => {
    const supabase = useSupabaseClient()
    
    const loginAnonymously = async () => {
        console.log('click')
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
            console.log(error);
            return;
        }

        console.log('success');

        await navigateTo('/invoice/create');
        return;
    }

    const signInWithEmail = async (mail: string, pass: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: mail,
            password: pass,
        })

        if (error) {
            console.log(error);
            return;
        }

        console.log('success', data);
        // window.location.href = "/dashboard"
        return;
    };

    return {
        loginAnonymously,
        signInWithEmail
    }
}