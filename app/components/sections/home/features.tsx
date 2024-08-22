import Cards from "../../cards";


const Features = () => {
    const features =[
        {
id:1,
feature: 'Free shipping',
content: 'Free shipping of orders above $100',
img: '/assets/icons/truck-solid.svg',
    },
    {
        id:2,
        feature: 'Secure payment',
        content: 'We provide 100% secure payment',
        img: '/assets/icons/check.svg',
            },
            {
                id:3,
                feature: 'Best price',
                content: 'We guarantee best price ',
                img: '/assets/icons/tag.svg',
                    },
                    {
                        id:4,
                        feature: 'Free returns',
                        content: 'Within 30days return',
                        img: '/assets/icons/returns.svg',
                            },
]
    return ( <section className="flex gap-8  py-20 items-center justify-center  flex-wrap xs:py-10  xs:px-4">
        {features.map((data)=>(
            <Cards features key={data.id} {...data}/>
        ))}

    </section> );
}
 
export default Features;
