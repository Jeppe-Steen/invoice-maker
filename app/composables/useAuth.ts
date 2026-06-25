export const useAuth = () => {
    const supabase = useSupabaseClient()

    const user = useSupabaseUser()
    const isLoggedIn = computed(() => !!user.value)
    const isAnonymous = computed(() => user.value?.is_anonymous)
    const isRegisteredUser = computed(() => !user.value?.is_anonymous)
    
    const loginAnonymously = async () => {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
            console.log(error);
            return;
        }

        await navigateTo('/invoice/create');
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

        await navigateTo('/dashboard');
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {
        console.error(error)
        return
        }

        await navigateTo('/')
    }

    return {
        isLoggedIn,
        isAnonymous,
        isRegisteredUser,

        loginAnonymously,
        signInWithEmail,
        logout
    }
}