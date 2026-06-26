// composables/useProfile.ts

export const useProfile = () => {
  const supabase = useSupabaseClient()

  const profile = useState<any | null>('profile', () => null)

  const loadProfile = async () => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError) {
      console.error(userError)
      return
    }

    if (!user || user.is_anonymous) {
      profile.value = null
      return
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error(error)
      profile.value = null
      return
    }

    profile.value = data
  }

  const clearProfile = () => {
    profile.value = null
  }

  return {
    profile,
    loadProfile,
    clearProfile
  }
}