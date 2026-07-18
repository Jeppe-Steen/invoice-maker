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
        <UiHeader centered>
            <template #title>
                <h1>Velkommen til InvoiceMaker</h1>
            </template>
        </UiHeader>

        <span class="login-container--text">
            <p>Opret professionelle fakturaer på få minutter.</p>
            <p>Log ind for at gemme, sende og holde styr på dine fakturaer.</p>
        </span>

        <article class="login-container--content">
            <UiForm @submit="loginWithEmail(loginCodentials.mail, loginCodentials.password)">
                <UiInput name="email" placeholder="Email" type="email" required v-model="loginCodentials.mail" rounded />
                <UiInput name="password" placeholder="Kodeord" type="password" required v-model="loginCodentials.password" rounded />
                <UiButton label="Log ind" size="large" submit />
            </UiForm>

            <div class="divider"></div>

            <UiButton
                label="Prøv uden konto" 
                type="secondary" 
                size="large"
                @click="loginAnonymously"
            />

            <span class="small-text">
                <p>* Som gæst kan du oprette og downloade fakturaer, men de bliver ikke gemt og kan ikke sendes via InvoiceMaker.</p>
                <p>* InvoiceMaker er i øjeblikket under udvikling. Oprettelse af nye konti er derfor midlertidigt lukket. Hvis du ønsker en konto, er du velkommen til at kontakte os på mail@mail.com.</p>
            </span>
        </article>
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

        &--text {
            display: flex;
            flex-direction: column;
            text-align: center;
        }

        &--content {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;

            .divider {
                width: 100%;
                height: 1px;
                background-color: black;
            }

            .small-text {
                display: flex;
                flex-direction: column;
                gap: .5rem;
                font-size: .7rem;
                font-style: italic;
            }
        }
    }
</style>