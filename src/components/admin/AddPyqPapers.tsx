import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface AddPyqPapersProps {
    active: boolean;
}

const AddPyqPapers: React.FC<AddPyqPapersProps> = ({ active }) => {
    if (!active) return null;

    return (
        <div>
            <Card className="rounded-lg">
                <CardHeader>
                    <CardTitle>Add PYQ Papers</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action="">
                        
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AddPyqPapers;