<script setup>
    definePageMeta({
        layout: 'full',
    })

    const testArray = [1, 2, 3, 4]
</script>

<template>
    <section class="hero">
        <header>
            <h1>Create professional invoices in minuts</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit rem eos recusandae aut commodi officia, modi iste non molestias, voluptatibus exercitationem dolor saepe error corrupti ab. Aliquid saepe aut ut?</p>
        </header>
        <span>
            <UiButton label="Start here" styling="secondary"/>
            <UiButton label="Login"/>
        </span>
    </section>

    <section class="features">
        <header>
            <h2>Features included</h2>
        </header>
        <span>
            <article v-for="item in testArray">
                <h3>Text here!</h3>
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias necessitatibus minus eaque pariatur doloribus voluptas quasi vel repudiandae.</p>
            </article>
        </span>
    </section>

    <section class="ready">
        <header>
            <h2>Ready to create your first invoice?</h2>
        </header>
        <UiButton label="Create invoice now" size="big" />
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
        gap: 1rem;

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
            gap: 1rem;
            width: 100%;

            article {
                width: 20%;
                height: fit-content;
                padding: 1rem;
                text-align: center;

                display: flex;
                flex-direction: column;
                gap: .5rem;

                color: var(--text-color-2)
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