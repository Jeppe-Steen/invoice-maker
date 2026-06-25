export const useAuth = () => {
    const supabase = useSupabaseClient()

    const user = useSupabaseUser()
    const isLoggedIn = computed(() => !!user.value)
    const isAnonymous = computed(() => user.value?.is_anonymous)
    const isRegisteredUser = computed(() => !user.value?.is_anonymous)
    
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
        isLoggedIn,
        isAnonymous,
        isRegisteredUser,

        loginAnonymously,
        signInWithEmail
    }
}