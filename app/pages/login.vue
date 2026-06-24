<script setup>
    definePageMeta({
        layout: 'login',
    })

    const loginCodentials = ref({
        mail: '',
        password: ''
    })

    const LoginAsCustomer = () => {
        console.log('Customer login', loginCodentials.value);
        return;
    }

    const loginAsGuest = () => {
        console.log('Guest login');
        return;
    }
    
</script>

<template>
    <section class="login-container">
        <header>
            <h1>Velkommen til!</h1>
            <p>Her har du mulighed for at oprette faktura'er.</p>
            <p>Helt simpelt og enkelt</p>
        </header>

        <article>
            <UiInput placeholder="E-mail" v-model="loginCodentials.mail" rounded/>
            <UiInput placeholder="Password" v-model="loginCodentials.password" rounded/>
            <UiButton label="Log ind" @click-event="LoginAsCustomer"/>
        </article>

        <div class="divider"></div>

        <article>
            <UiButton label="Fortsæt som gæst" styling="secondary" @click-event="loginAsGuest"/>
        </article>

        <span class="small-text">
            <p><strong>*</strong> Som gæst er det ikke muligt at gemme/sende sin faktura, KUN downloade.</p>
            <p><strong>*</strong> Da siden stadig er under udvikling, vi ldet ikke være muligt selv at oprette en konto, men det er altid muligt at kontakte: <strong>mail@mail.com</strong> - vedr. mulighed for oprettelse</p>
        </span>
    </section>
</template>

<style lang="scss" scoped>
    .login-container {
        width: 500px;
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