import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog"

const Alertbox = ({ Title, Description, onSubmit, onCancel, button }) => {
    return (
        <AlertDialog defaultOpen={true}>
            <AlertDialogContent className="w-[400px] max-sm:w-[330px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>{Title}</AlertDialogTitle>
                    <AlertDialogDescription>{Description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => { onCancel(e)}}>{button.second}</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => { onSubmit(e)}}>{button.main}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default Alertbox;