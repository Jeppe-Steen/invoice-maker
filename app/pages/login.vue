<script setup>
    import { useAuth } from '~/composables/useAuth';
    const { loginAnonymously, loginWithEmail } = useAuth();

    definePageMeta({
        layout: 'login',
    })

    const loginCodentials = ref({
        mail: '',
        password: ''
    })
    
</script>

<template>
    <section class="login-container">
        <header>
            <h1>Velkommen til InvoiceMaker</h1>
            <p>Opret professionelle fakturaer på få minutter.</p>
            <p>Log ind for at gemme, sende og holde styr på dine fakturaer.</p>
        </header>

        <article>
            <UiInput
                placeholder="E-mail"
                v-model="loginCodentials.mail"
                rounded
            />
            <UiInput
                placeholder="Password"
                type="password"
                v-model="loginCodentials.password"
                rounded
            />

            <UiButton
                label="Log ind"
                size="big"
                @click="loginWithEmail(loginCodentials.mail, loginCodentials.password)"
            />
        </article>

        <div class="divider"></div>

        <article>
            <UiButton
                label="Prøv uden konto" 
                styling="secondary" 
                size="big"
                @click="loginAnonymously"
            />
        </article>

        <span class="small-text">
            <p>* Som gæst kan du oprette og downloade fakturaer, men de bliver ikke gemt og kan ikke sendes via InvoiceMaker.</p>
            <p>* InvoiceMaker er i øjeblikket under udvikling. Oprettelse af nye konti er derfor midlertidigt lukket. Hvis du ønsker en konto, er du velkommen til at kontakte os på mail@mail.com.</p>
        </span>
    </section>
</template>

<style lang="scss" scoped>
    .login-container {
        width: 550px;
        height: fit-content;
        border-radius: 20px;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        padding: 2rem;

        color: var(--text-color-1);

        header {
            text-align: center;
        }

        article {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
        }

        .divider {
            width: 100%;
            height: 2px;
            background-color: lightgrey;
        }

        .small-text {
            display: flex;
            flex-direction: column;
            gap: .5rem;
            font-size: .7rem;
            font-style: italic;
        }
    }
</style>