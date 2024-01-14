<div>

</div>

<style>
    div {
        width: 100%;
        height: 200px;
        background: linear-gradient(90deg, #f4f4f480, #dddddd80, #f4f4f480);
        background-size: 200%;
        animation: move 3s ease infinite;
        border-radius: 4px;
    }

    @keyframes move {
        0% {
            background-position-x: 0%;
        }

        100% {
            background-position-x: 200%;
        }
    }
</style>