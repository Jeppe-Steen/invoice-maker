<script setup>
    definePageMeta({
        layout: 'full',
    })

    const testArray = [
        { heading: 'Anonym brug', text: 'Du har mulighed for at bruge siden uden nogen form for binding og oprettelse.' },
        { heading: 'Hurtig fakturering', text: 'På bare få minutter, er du allerede igang med at hente og sende din første faktura.' },
        { heading: 'Økonomisk overblik', text: 'Se samlet overblik over hvormeget du har har faktureret for.' },
    ];

    const loginAsGuest = () => {
        console.log('Guest login');
        return;
    }
</script>

<template>
    <section class="hero">
        <header>
            <h1>Opret professionelle faktura'er på bare få minutter!</h1>
            <span>
                <p>Har du brug for at oprette en faktura, eller måske brug for et overbliv over hvormeget du har sendt faktura'er for?</p>
                <p>Så kan vi hjælpe, det tager ikke mere end et par minutter - så er den første faktura klar!</p>
            </span>
        </header>
        <span>
            <UiButton label="Start som gæst" styling="secondary" @click-event="loginAsGuest"/>
            <UiButton label="Log ind" type="link" to="/login"/>
        </span>
    </section>

    <section class="features">
        <header>
            <h2>Dette får du med InvoiceMaker</h2>
        </header>
        <span>
            <article v-for="(item, index) in testArray" :key="index">
                <h3>{{ item.heading }}</h3>
                <p>{{ item.text }}</p>
            </article>
        </span>
    </section>

    <section class="ready">
        <header>
            <h2>Klar til at oprette din første faktura?</h2>
        </header>
        <UiButton label="Kun et klik væk - Opret nu" size="big" type="link" to="/login"/>
    </section>
</template>

<style lang="scss" scoped>
    .hero {
        width: 100%;
        height: 60vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;

        header {
            text-align: center;
            width: 60%;

            display: flex;
            flex-direction: column;
            gap: .5rem;

            span {
                display: flex;
                flex-direction: column;
                gap: 0;
            }
        }

        span {
            display: flex;
            flex-direction: row;
            gap: 1rem;
        }
    }

    .features {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;

        width: 100%;
        height: 50vh;

        background-color: var(--background-reversed);

        header {
            color: var(--text-color-2);
        }

        span {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
            gap: 3rem;
            width: 100%;

            article {
                width: 20%;
                height: 200px;
                padding: 1rem;
                text-align: left;
                border-radius: 20px;

                display: flex;
                flex-direction: column;
                gap: .5rem;

                color: var(--text-color-2);
                background-color: #3b3b3b51;
            }
        }
    }

    .ready {
        width: 100%;
        height: 40vh;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }
</style>