export const useDashboard = () => {
    const dashboard = useState('dashboard', () => ({
        latestInvoices: [],
        stats: {
            revenue: 0,
            invoiceCount: 0,
        }
    }))

    const loadDashboard = async () => {
        dashboard.value = await $fetch('/api/dashboard')
    }

    return {
        dashboard,
        loadDashboard
    }
}