import { useEffect, useState } from "react";

const dashboard = () => {

    const [data, setData] = useState<string>("");

    useEffect(() => {
        try {
            fetch('/api/hello')
                .then(response => response.json())
                .then(data => setData(data.name));
        }
        catch (error) {
            console.error("Error fetching data:", error);
            setData("Error fetching data");
        }
    },[]);



    return (
        <div>
            <p>{data}</p>
        </div>
    );
}

export default dashboard;