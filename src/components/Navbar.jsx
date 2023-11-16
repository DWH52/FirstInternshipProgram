import Link from "next/link";
import Image from "next/image";
import bloomingfoodsLogo from '../../public/bloomingfoodsLogo.png'

export default function Navbar(){
    const imageStyle = {borderRadius: '50%'};
    return(
    <> 
        <div className="m-5 pr-10 shrink-0">
            <Link href="/" className="">
                <Image priority = {true} className="rounded-full"
                    src={bloomingfoodsLogo} 
                    alt="Bloomingfoods Logo"
                    width={60}
                    height={60}
                    style={imageStyle}
                    />
            </Link>
        </div>       
        <div className="w-full h-14 items-center mx-8 my-4 justify-between inline-flex ">
            <h1 className="w-full text-xl"><strong>Bloomingfoods HR Program</strong></h1>
            <div className="ml-24 w-full flex justify-end gap-x-8">
            <Link href="/supervisor/promotion" className="">Supervisor Promotion</Link>
            <Link href="/supervisor/demotion" className="">Supervisor Demotion</Link>
            <Link href="/admin" className="flex">Admin</Link>
            </div>
        </div>
    </>

    )
}
