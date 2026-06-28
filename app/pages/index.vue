<script setup>
    import { useAuth } from '~/composables/useAuth'
    const { loginAnonymously } = useAuth();
    definePageMeta({
        layout: 'full',
    })

    const testArray = [
        { heading: 'Prøv uden oprettelse', text: 'Opret din første faktura med det samme – helt uden at oprette en konto.' },
        { heading: 'Hurtig fakturering', text: 'Opret professionelle fakturaer på få minutter med automatisk beregning af moms og total.' },
        { heading: 'Økonomisk overblik', text: 'Gem dine fakturaer sikkert og få et samlet overblik over fakturanumre og omsætning.' },
        { heading: "Professionelle PDF'er", text: 'Download fakturaer som flotte PDF-filer, klar til at sende eller printe.' },
        { heading: "Send direkte", text: 'Send fakturaen direkte til kunden via e-mail med få klik.' },
        { heading: "Automatisk nummerering", text: 'Fakturanumre håndteres automatisk, så du slipper for manuelt arbejde.' },
    ];
</script>

<template>
    <section class="hero">
        <header>
            <h1>Opret professionelle fakturaer på få minutter</h1>
            <span>
                <p>Slip for Word-skabeloner og manuelle beregninger.</p>
                <p>InvoiceMaker hjælper dig med at oprette flotte fakturaer på få minutter.</p>
            </span>
        </header>
        <span>
            <UiButton
                label="Prøv gratis"
                styling="secondary"
                @click="loginAnonymously"
            />
            <UiButton
                label="Log ind"
                to="/login"
            />
        </span>
    </section>

    <section class="features">
        <header>
            <h2>Alt du skal bruge til fakturering</h2>
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
            <p>Det tager mindre end to minutter at komme i gang.</p>
        </header>
        <span>
            <UiButton
                label="Opret din første faktura"
                size="big"
                :to="'/login'"
            />
       </span>
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
        height: 80vh;

        background-color: var(--background-reversed);

        header {
            color: var(--text-color-2);
        }

        span {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 2rem;
            width: 80%;

            article {
                width: 100%;
                height: fit-content;
                padding: 25px;
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

        header {
            text-align: center;
            width: 60%;

            display: flex;
            flex-direction: column;
            gap: .5rem;
        }
    }
</style>