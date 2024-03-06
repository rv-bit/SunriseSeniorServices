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

export const Alertbox = ({ Title, Description, onSubmit, onCancel }) => {
    return (
        <AlertDialog defaultOpen={true}>
            <AlertDialogContent className="w-[400px] max-sm:w-[330px]">
                <AlertDialogHeader>
                    <AlertDialogTitle>{Title}</AlertDialogTitle>
                    <AlertDialogDescription>{Description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={(e) => { onCancel(e)}}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => { onSubmit(e)}} >Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}