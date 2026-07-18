<script setup>
    import { useAuth } from '~/composables/useAuth'
    const { loginAnonymously } = useAuth();

    definePageMeta({
        layout: 'full',
    })

    //hero section
    const heroBtns = [
        { label: 'Prøv gratis', type: 'secondary', action: loginAnonymously },
        { label: 'Log ind', to: '/login' },
    ]

    const testArray = [
        { heading: 'Prøv uden oprettelse', text: 'Opret din første faktura med det samme – helt uden at oprette en konto.', icon: { name: 'pen', size: 40, backgroundSize: 55, color: '#6594B1', background: '#6594B130'} },
        { heading: 'Hurtig fakturering', text: 'Opret professionelle fakturaer på få minutter med automatisk beregning af moms og total.', icon: { name: 'clock', size: 40, backgroundSize: 55, color: '#6594B1', background: '#6594B130'} },
        { heading: 'Økonomisk overblik', text: 'Gem dine fakturaer sikkert og få et samlet overblik over fakturanumre og omsætning.', icon: { name: 'shop', size: 40, backgroundSize: 55, color: '#6594B1', background: '#6594B130'} },
        { heading: "Professionelle PDF'er", text: 'Download fakturaer som flotte PDF-filer, klar til at sende eller printe.', icon: { name: 'document', size: 40, backgroundSize: 55, color: '#6594B1', background: '#6594B130'} },
        { heading: "Send direkte", text: 'Send fakturaen direkte til kunden via e-mail med få klik.', icon: { name: 'check', size: 40, backgroundSize: 55, color: '#6594B1', background: '#6594B130'} },
        { heading: "Automatisk nummerering", text: 'Fakturanumre håndteres automatisk, så du slipper for manuelt arbejde.', icon: { name: 'plus', size: 40, backgroundSize: 55, color: '#6594B1', background: '#6594B130'} },
    ];
</script>

<template>
    <section class="hero">
        <UiHeader centered>
            <template #title>
                <h1>Opret professionelle fakturaer på få minutter</h1>
            </template>
        </UiHeader>

        <span class="hero--description">
            <p>Slip for Word-skabeloner og manuelle beregninger.</p>
            <p>InvoiceMaker hjælper dig med at oprette flotte fakturaer på få minutter.</p>
        </span>

        <span class="hero--btns">
            <UiButton v-for="(btns, index) in heroBtns" :key="index"
                :label="btns?.label"
                :type="btns?.type"
                :to="btns?.to"
                :size="btns?.size"
                @click="btns.action?.()"
            />
        </span>
    </section>

    <section class="features">
        <UiHeader centered>
            <template #title>
                <h2>Alt du skal bruge til fakturering</h2>
            </template>
        </UiHeader>

        <article class="features--content">
            <UiCard v-for="(item, index) in testArray" :key="index" rounded shadow>
                <UiHeader>
                    <template #title>
                        <h3>{{ item.heading }}</h3>
                    </template>
                </UiHeader>

                <span class="feature--content">
                    <p>{{ item.text }}</p>
                    <UiIcon
                        :name="item.icon?.name"
                        :color="item.icon?.color"
                        :background="item.icon?.background" 
                        :size="item.icon?.size"
                        :backgroundSize="item.icon?.backgroundSize"
                        rounded
                    />
                </span>
            </UiCard>
        </article>
    </section>

    <section class="ready">
        <UiHeader centered>
            <template #title>
                <h2>Klar til at oprette din første faktura?</h2>
            </template>
        </UiHeader>

        <p>Det tager mindre end to minutter at komme i gang.</p>
        
        <span>
            <UiButton
                label="Opret din første faktura"
                size="large"
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

        &--description {
            display: flex;
            flex-direction: column;
            text-align: center;
            gap: .5rem;
        }

        &--btns {
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
        height: 70vh;

        background-color: var(--primary-color);

        &--content {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 2rem;
            width: 80%;

            .feature {
                &--content {
                    display: grid;
                    grid-template-columns: 1fr .2fr;
                    gap: 1rem;
                }
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