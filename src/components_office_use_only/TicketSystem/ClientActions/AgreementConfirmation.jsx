import React, { useEffect, useRef, useState } from "react";
import { useUpdateClientCreation } from "../../ClientCreation/services";
import { useClientDetails, useDataForAgreementAandSD, useFetchSystemInfo } from "./services";
import { toast } from "react-toastify";
import { useApp } from "../AppProvider";
// import clientAgreement from "../../../images_of_female_pg/ClientAgreement_GPGS.pdf";
// import LoaderPage from "../../NewBooking/LoaderPage";

export default function AgreementConfirmation() {
  const [step, setStep] = useState(1); // 1 = first modal, 2 = second, 3 = done
  const [digitalSelfDeclearationAccepted, setDigitalSelfDeclearationAccepted] = useState(false);
  const [digitalPGLegalDocAccepted, setDigitalPGLegalDocAccepted] = useState(false);

  const contentRef = useRef(null);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  // const [digitalSelfDeclearationAccepted, setDigitalSelfDeclearationAccepted] = useState(false);
  //   console.log(1212121212 , isScrolledToBottom)
        


  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;

      const isBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 10; // small offset for safety

      if (isBottom) {
        setIsScrolledToBottom(true);
      }
    };

    const el = contentRef.current;
    if (el) el.addEventListener("scroll", handleScroll);

    return () => {
      if (el) el.removeEventListener("scroll", handleScroll);
    };
  }, []);















  const { decryptedUser } = useApp();
  const { mutate: update, isPending: isUpdating } = useUpdateClientCreation();
  const { data: SystemInfo } = useFetchSystemInfo();
  const { data: ClientDetails } = useClientDetails();

  const filteredClientData = ClientDetails?.data?.find(
    (ele) => ele.ClientID === decryptedUser?.clientID
  );

  const excludedKeys = [
    "DigitalSelfDeclearationAccepted",
    "DigitalPGLegalDocAccepted",
    "DigitalSignedDetails",
  ];

  const filteredData =
    filteredClientData &&
    Object.fromEntries(
      Object.entries(filteredClientData).filter(
        ([key]) => !excludedKeys.includes(key)
      )
    );


  const closeFirstAgreement = () => {
    if (digitalSelfDeclearationAccepted) setStep(2);
    const data = {
      ClientID: decryptedUser?.clientID ?? "",
      PropertyCode: decryptedUser?.propertyCode ?? "",
      DigitalSelfDeclearationAccepted: digitalSelfDeclearationAccepted ? digitalSelfDeclearationAccepted : "",
      DigitalPGLegalDocAccepted: digitalPGLegalDocAccepted ? digitalPGLegalDocAccepted : "",

      ...filteredData,
      DigitalSignedDetails: {
        ...SystemInfo,
        DateTime: new Date(),
        EmailID: decryptedUser?.loginId ?? "",  // use actual user email if available
        ClientId: decryptedUser?.clientID ?? "",
      },
    };
    update(data, {
      onSuccess: () => {
        toast.dismiss();
        toast.success("Agreed successfully");
      },
      onError: (error) => {
        toast.dismiss();
        toast.error("Something went wrong. Please try again.");
        console.error("Update failed:", error);
      },
    });
  };

  const closeSecondAgreement = () => {
    if (!digitalPGLegalDocAccepted) return; // stop if not checked

    setStep(3);

    // console.log(digitalSelfDeclearationAccepted, digitalPGLegalDocAccepted);

  };
  {/* <p><strong>AGREEMENT ( Terms &amp; Conditions ) </strong>1. Smoking and Hard drinks are not allowed inside the Paying Guest Facility, also keeping such things / packets in open will not be tolerated.&nbsp;</p><p>2. Friends are not allowed inside the Paying Guest Facility for any reason, Relatives are allowed to stay overnight in the Paying Guest Facility depending upon the availability and management's approval and the stay is chargeable.</p><p>&nbsp;3. In your absence or presence you do not have rights to allow anyone else to stay on your bed or someone else's bed in the pg facility.</p><p>&nbsp;4. <strong>Notice Period</strong> : It should be communicated on whatsapp or text message to our <strong>customer care number ( 8928 191 814 )</strong>, verbal communication and communication to our staff members will not be considered / entertained. If you wish to vacate the Paying Guest Facility <strong>one month's notice period</strong> is mandatory, so the rent is applicable / chargeable for next one month from the date you give the notice whether you stay or not. Please Note the deposit amount will not be adjusted as rent during the notice period.</p><p>&nbsp;5. <strong>Full &amp; Final Settlement Amount</strong> : After the LICENSEE vacates the said premises in a peaceful state and with complete handover, the LICENSOR will try to refund the full and final settlement amount the same day, but at times may get delayed due to some or the other reason, so we request LICENSEE to grant us a three days time to refund the full and final settlement amount.</p><p>&nbsp;6. <strong>Rent</strong> is to be paid by 1st of every month or max by 3rd of every month, else a 50 INR fine will be charged per day from 4th of every month.</p><p>&nbsp;7. In case of serious illness or infectious disease, the LICENSEE is requested to shift from the Paying Guest Facility to stay with the Local Guardians / Parents.&nbsp;</p><p>8. None of our paying guest facilities have any security person available, you're an adult person so please take responsibility for your own security during arguments or fights with your roommates / flatmates, we as management will try our best to sort out such arguments / fights but we do not take any responsibility for anyone's loss in any sense.</p><p>&nbsp;9. LICENSEE should keep all the valuables locked inside the wardrobe, management will not be responsible for any loss / theft. Paying Guest Management is not responsible for your vehicle damage or theft, so park your vehicle at your own risk.&nbsp;</p><p>10. Parking of any vehicle space is allotted depending upon the space availability and it may be chargeable as per Society rules.&nbsp;</p><p>11. Paying Guest Facility management is not responsible for the LICENSEE in person nor for the LICENSEE belongings kept inside or outside the property in any sense.</p><p>&nbsp;12. The LICENSEE will be held responsible for not following the rules, any breakage / damage to the Paying Guest Facility. In all such cases, LICENSEE will have to pay the cost of such breakage / damage, LICENSEE will be asked to vacate the Paying Guest Facility immediately and if required POLICE will be involved.</p><p>&nbsp;13. The LICENSEE is not allowed to go out or come inside of the Paying Guest Facility after 11 PM except for those working in the 2nd or 3rd shift.</p><p>&nbsp;14.<strong> Electricity Bill</strong> : Paying Guest Facility management gives free electricity up to 150 INR per person for Non AC Paying Guest Facility and 250 INR per person for AC Paying Guest Facility, total free electricity is calculated based on the number of people staying in the Paying Guest Facility for that particular month of electricity bill cycle as per the power provider company, excess amount will be equally divided among the number of people staying in the Paying Guest Facility and this amount needs to be paid along with the monthly rent. Also note if you happen to be not in a paying facility for a complete 15 days without any break then please inform Paying Guest Management, we will exempt you for the electricity bill for those 15 days.</p><p>&nbsp;15. <strong>Booking Cancellation Penalty Amount </strong>: <strong>CASE I </strong>: If the booking is canceled before the date of joining, in this case the penalty amount is 1 Month rent.</p><p>&nbsp;<strong>CASE II</strong> : If the booking is canceled after the date of joining, in this case the <strong>Rule No. 4</strong> mentioned above is applicable.&nbsp;</p><p>16. <strong>Booking Auto Cancellation</strong> : If you have reserved the bed by paying the minimum booking amount as per our deal, we will hold your reservation for maximum 10 days from the scheduled date of joining, after this it gets auto canceled.&nbsp;</p><p>17. <strong>Increase in the monthly rent</strong> : It is Gopal’s Paying Guest Services management decision. We try to inform everyone a minimum 45 days in advance before we increase the monthly rent. In this paying guest business it is practically not possible to wait for every individual to complete an 11 months stay from the date of joining.&nbsp;</p><p>18. Gopal’s Paying Guest Services not being the sole owner of this said premises, so we will not be able to support you with any supporting documents in regards to Passport / Vehicle Registration / Bank Loan Process / Etc.&nbsp;</p><p>19. Gopal’s Paying Guest Services has complete rights to make changes in the ongoing services and these decisions are taken based on time, place and circumstances.</p><p>&nbsp;20. The rent increment decision is completely based on the management's decision and not dependent upon the tenure the pg client has completed in our pg facility.</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<strong>Self Declaration Form</strong></p><p>&nbsp;I, (Full Name), hereby declare and agree to the following during my stay at <strong>Gopal’s Paying Guest Services (GPGS)</strong>.</p><p>&nbsp;<strong>Note </strong>: Here after below we are using the abbreviation of Gopal’s Paying Guest Services as <strong>GPGS&nbsp;</strong></p><p><strong>Rules &amp; Regulations</strong></p><p>&nbsp;● I have read, understood and agreed to abide by all the rules, terms and conditions of GPGS.</p><p>&nbsp;● I understand that violation of the rules may lead to penalties or termination of my stay without refund.&nbsp;</p><p><strong>Rent &amp; Payments</strong></p><p>&nbsp;● I understand that the booking amount is non-refundable.&nbsp;</p><p>● I agree to pay rent, electricity, parking charges*, previous due*, and other charges* on time (i.e. 1st to 3rd of every month). From 4th of every month the late fee of Rs.50 per day will be applied till the complete payment is received.</p><p>&nbsp;● I understand that the AC Electricity bill will be calculated as per the AC consumption data provided by everyone in that room through the google sheet created and shared by GPGS. Even if one person is not cooperating to maintain the required data then GPGS have no choice but to divide the AC bill amount equally among everyone in that room.</p><p><strong>&nbsp;Code of Conduct</strong></p><p>&nbsp;● I will not engage in activities prohibited by the management, including smoking, consuming alcohol, using drugs, playing loud music, and I will always maintain good behavior with the neighborhood.</p><p>&nbsp;● I will provide one month prior written notice only. I also understand the rent is applicable for next one month from the date I have given the notice even if I stay or not.</p><p>&nbsp;● I understand that the Full &amp; Final (FNF) settlement amount will be processed after the PG facility is vacated with proper handover and it will take three working days as the FNF settlement report goes through an approval process and requires time, I will take care not pressurize the management unnecessarily.</p><p>● Entry and Exit after 11:00 PM ( IST ) is not allowed, except for professionals working in the second shift and in such cases in writing it should be communicated.</p><p>&nbsp;● I will maintain respectful behavior with fellow residents and GPGS team at all times and will not get involved in fights (verbal/physical) with anyone and it may lead to stay termination.</p><p>&nbsp;● I understand the GPGS team is not responsible for handling my luggage during joining, shifting, or vacating the PG facility.&nbsp;</p><p>● I will not bring unauthorized visitors and it may lead to stay termination.&nbsp;</p><p>● I understand the uncleaned utensils or unattended items and expired products will be disposed of during our regular routine inspections.&nbsp;</p><p>● I understand that the management will not be responsible for any loss, theft, or damage to my personal belongings at the PG facility. I am advised not to keep any valuables and important items in the PG facility.</p><p>&nbsp;● I understand that I am responsible for my personal belongings. I will keep all items properly in the wardrobe and on the bed so that the GPGS team can easily carry out housekeeping work on a daily basis.&nbsp;</p><p>● I understand that in case of any misconduct, indiscipline or violation of GPGS policies, the fine amount will be One Month rent starting from that date and immediate eviction from the PG Property.&nbsp;</p><p>● I understand that any legal disputes or related expenses arising from such misconduct shall be fully borne by me.</p><p>&nbsp;<strong>Maintenance and Housekeeping Concerns</strong></p><p>&nbsp;● I will raise tickets for maintenance and housekeeping related concerns through the GPGS Application. I will not make any verbal communications to the GPGS team.</p><p>&nbsp;● I understand certain maintenance activities are dependent on external vendors so the fixes may take time and I will keep practical expectations from GPGS regarding services.&nbsp;</p><p><strong>Medical &amp; Safety Disclaimer</strong></p><p>&nbsp;● I declare that I am medically and mentally fit to stay at the PG.&nbsp;</p><p>● I will inform the management of any health conditions during my stay.&nbsp;</p><p><strong>Legal &amp; Acknowledgment</strong></p><p>&nbsp;● I declare that I have no criminal background or pending legal cases.&nbsp;</p><p>● I confirm that the above is true to the best of my knowledge. I agree to comply with all GPGS rules and understand that violation may lead to immediate eviction without refund.&nbsp;</p><p>● All this is to serve you better but we also need full cooperation from you</p> */ }
  const {data , isPending} = useDataForAgreementAandSD()
   console.log(1111111, data?.data)
  const clientAgree = data?.data ? data?.data?.map(ele=>ele.DegitalAandSD) : ""
//   const clientAgree = `
//     <p class="font-bold text-xl">AGREEMENT ( Terms & Conditions )</p>
// 1. Smoking and Hard drinks are not allowed inside the Paying Guest Facility, also
// keeping such things / packets in open will not be tolerated.

// 2. Friends are not allowed inside the Paying Guest Facility for any reason, Relatives
// are allowed to stay overnight in the Paying Guest Facility depending upon the
// availability and management's approval and the stay is chargeable.

// 3. In your absence or presence you do not have rights to allow anyone else to stay on
// your bed or someone else's bed in the pg facility.

// <p>4. <strong className = >Notice Period</strong> : It should be communicated on whatsapp or text message to our
// <strong>customer care number ( 8928 191 814 )</strong>, verbal communication and
// communication to our staff members will not be considered / entertained. If you wish
// to vacate the Paying Guest Facility <strong>one month's notice period</strong> is mandatory, so the
// rent is applicable / chargeable for next one month from the date you give the notice
// whether you stay or not. Please Note the deposit amount will not be adjusted as rent
// during the notice period.</p>

// <p>
// 5. <strong>Full &amp; Final Settlement Amount</strong> : After the LICENSEE vacates the said premises
// in a peaceful state and with complete handover, the LICENSOR will try to refund the
// full and final settlement amount the same day, but at times may get delayed due to
// some or the other reason, so we request LICENSEE to grant us a three days time to
// refund the full and final settlement amount.
// </p>


// <p>
// 6. <strong>Rent</strong> is to be paid by 1st of every month or max by 3rd of every month, else a 50
// INR fine will be charged per day from 4th of every month.</P>

// 7. In case of serious illness or infectious disease, the LICENSEE is requested to
// shift from the Paying Guest Facility to stay with the Local Guardians / Parents.
// 8. None of our paying guest facilities have any security person available, you're an
// adult person so please take responsibility for your own security during arguments or
// fights with your roommates / flatmates, we as management will try our best to sort
// out such arguments / fights but we do not take any responsibility for anyone's loss in
// any sense.

// 9. LICENSEE should keep all the valuables locked inside the wardrobe, management
// will not be responsible for any loss / theft. Paying Guest Management is not
// responsible for your vehicle damage or theft, so park your vehicle at your own risk.
// 10. Parking of any vehicle space is allotted depending upon the space
// availability and it may be chargeable as per Society rules.

// 11. Paying Guest Facility management is not responsible for the LICENSEE in person
// nor for the LICENSEE belongings kept inside or outside the property in any sense.

// 12. The LICENSEE will be held responsible for not following the rules, any breakage /
// damage to the Paying Guest Facility. In all such cases, LICENSEE will have to pay the
// cost of such breakage / damage, LICENSEE will be asked to vacate the Paying Guest
// Facility immediately and if required POLICE will be involved.

// 13. The LICENSEE is not allowed to go out or come inside of the Paying Guest Facility
// after 11 PM except for those working in the 2nd or 3rd shift.

// <p>14.<strong> Electricity Bill</strong> : Paying Guest Facility management gives free electricity up to
// 150 INR per person for Non AC Paying Guest Facility and 250 INR per person for AC
// Paying Guest Facility, total free electricity is calculated based on the number of people
// staying in the Paying Guest Facility for that particular month of electricity bill cycle as
// per the power provider company, excess amount will be equally divided among the
// number of people staying in the Paying Guest Facility and this amount needs to be
// paid along with the monthly rent. Also note if you happen to be not in a paying facility
// for a complete 15 days without any break then please inform Paying Guest
// Management, we will exempt you for the electricity bill for those 15 days.</p>&nbsp;
// <p>15. <strong>Booking Cancellation Penalty Amount </strong> :
// <strong>CASE I </strong> : If the booking is canceled before the date of joining, in this case the penalty
// amount is 1 Month rent.

// <strong>CASE II </strong> : If the booking is canceled after the date of joining, in this case the Rule
// <strong>No. 4</strong> mentioned above is applicable.</p>&nbsp
// <P>16. <strong>Booking Auto Cancellation</strong> : If you have reserved the bed by paying the
// minimum booking amount as per our deal, we will hold your reservation for maximum
// 10 days from the scheduled date of joining, after this it gets auto canceled.</p>&nbsp
// <p>17. <strong>Increase in the monthly rent</strong> : It is Gopal’s Paying Guest Services management
// decision. We try to inform everyone a minimum 45 days in advance before we
// increase the monthly rent. In this paying guest business it is practically not possible to
// wait for every individual to complete an 11 months stay from the date of joining.</p>

// 18. Gopal’s Paying Guest Services not being the sole owner of this said premises, so
// we will not be able to support you with any supporting documents in regards to
// Passport / Vehicle Registration / Bank Loan Process / Etc.

// 19. Gopal’s Paying Guest Services has complete rights to make changes in the
// ongoing services and these decisions are taken based on time, place and
// circumstances.

// 20. The rent increment decision is completely based on the management's decision
// and not dependent upon the tenure the pg client has completed in our pg facility.

// <p><strong>Self Declaration Form</strong></p>&nbsp;
// <p class="">I, (Full Name), hereby declare and agree to the following during my stay at <strong>Gopal’s Paying
//  Guest Services (GPGS)</strong>.</p>&nbsp;
// <p class=""> <strong>Note </strong>: Here after below we are using the abbreviation of Gopal’s Paying Guest Services as 
// <strong>GPGS</strong></p>&nbsp;
// <p><strong>Rules & Regulations</strong>
// ● I have read, understood and agreed to abide by all the rules, terms and conditions of
// GPGS.

// ● I understand that violation of the rules may lead to penalties or termination of my stay
// without refund.</p>&nbsp;
// <p><strong>Rent & Payments</strong>
// ● I understand that the booking amount is non-refundable.

// ● I agree to pay rent, electricity, parking charges*, previous due*, and other charges* on
// time (i.e. 1st to 3rd of every month). From 4th of every month the late fee of Rs.50 per
// day will be applied till the complete payment is received.

// ● I understand that the AC Electricity bill will be calculated as per the AC consumption
// data provided by everyone in that room through the google sheet created and shared
// by GPGS. Even if one person is not cooperating to maintain the required data then
// GPGS have no choice but to divide the AC bill amount equally among everyone in that
// room.</p>&nbsp;
// <p><strong>Code of Conduct</strong>
// ● I will not engage in activities prohibited by the management, including smoking,
// consuming alcohol, using drugs, playing loud music, and I will always maintain good
// behavior with the neighborhood.

// ● I will provide one month prior written notice only. I also understand the rent is
// applicable for next one month from the date I have given the notice even if I stay or
// not.

// ● I understand that the Full & Final (FNF) settlement amount will be processed after the
// PG facility is vacated with proper handover and it will take three working days as the
// FNF settlement report goes through an approval process and requires time, I will take
// care not pressurize the management unnecessarily.

// ● Entry and Exit after 11:00 PM ( IST ) is not allowed, except for professionals working in
// the second shift and in such cases in writing it should be communicated.

// ● I will maintain respectful behavior with fellow residents and GPGS team at all times and
// will not get involved in fights (verbal/physical) with anyone and it may lead to stay
// termination.

// ● I understand the GPGS team is not responsible for handling my luggage during joining,
// shifting, or vacating the PG facility.

// ● I will not bring unauthorized visitors and it may lead to stay termination.

// ● I understand the uncleaned utensils or unattended items and expired products will be
// disposed of during our regular routine inspections.

// ● I understand that the management will not be responsible for any loss, theft, or
// damage to my personal belongings at the PG facility. I am advised not to keep any
// valuables and important items in the PG facility.

// ● I understand that I am responsible for my personal belongings. I will keep all items
// properly in the wardrobe and on the bed so that the GPGS team can easily carry out
// housekeeping work on a daily basis.

// ● I understand that in case of any misconduct, indiscipline or violation of GPGS policies,
// the fine amount will be One Month rent starting from that date and immediate eviction
// from the PG Property.

// ● I understand that any legal disputes or related expenses arising from such misconduct
// shall be fully borne by me.</p>&nbsp;
// <p class="mr-10"><strong>Maintenance and Housekeeping Concerns </strong>
// ● I will raise tickets for maintenance and housekeeping related concerns through the
// GPGS Application. I will not make any verbal communications to the GPGS team.

// ● I understand certain maintenance activities are dependent on external vendors so the
// fixes may take time and I will keep practical expectations from GPGS regarding
// services.</p>&nbsp;
// <p class="mr-10 md:mr-40"><strong>Medical & Safety Disclaimer</strong>
// ● I declare that I am medically and mentally fit to stay at the PG.
// ● I will inform the management of any health conditions during my stay.</p>
// &nbsp;<p class="mr-10"><strong>Legal & Acknowledgment</strong>
// ● I declare that I have no criminal background or pending legal cases.

// ● I confirm that the above is true to the best of my knowledge. I agree to comply with all
// GPGS rules and understand that violation may lead to immediate eviction without
// refund.

// ● All this is to serve you better but we also need full cooperation from you.</p>`

//  if(isPending){
//   return
//  }



// if(clientAgree.length == 0){
//   return <LoaderPage/>
// }
   

  return (
    <div className=" flex items-center justify-center overflow-auto scrollbar-hide bg-gray-100">
      {(step === 1) &&  (

        
        <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex overflow-auto scrollbar-hide items-center justify-center z-50">
          
          <div className="bg-white rounded-lg shadow-lg h-auto border border-orange-500 overflow-auto  scrollbar-hide max-w-full p-6">

            {step === 1 && (
              <>
                <div className="flex flex-col   items-center w-full">
                  {/* Scrollable Agreement Content */}
                  <div
                    ref={contentRef}
                    className="w-full h-[550px] mb-6 border overflow-auto scrollbar-hide p-4 whitespace-pre-wrap flex flex-col items-center"
                    dangerouslySetInnerHTML={{ __html: clientAgree }}
                  ></div>

                  {/* Checkbox & Button — visible only after scroll */}
                  {isScrolledToBottom && (
                    <label className="flex items-center justify-between  space-x-2 mb-6 w-full">
                      <div className="flex justify-center w-fit items-center gap-2">
                        <input
                          type="checkbox"
                          checked={digitalSelfDeclearationAccepted}
                          onChange={(e) => setDigitalSelfDeclearationAccepted(e.target.checked)}
                          className="h-5 w-5 accent-orange-300 text-white border-gray-300 rounded "
                        />
                        <span className="text-gray-700 text-sm">
                          I agree to abide by the above agreement and declaration
                        </span>
                      </div>

                      <div className="flex justify-center">
                        <button
                          onClick={closeFirstAgreement}
                          disabled={!digitalSelfDeclearationAccepted}
                          className={`px-4 py-2 rounded text-white transition ${digitalSelfDeclearationAccepted
                            ? "bg-orange-500 hover:bg-orange-600"
                            : "bg-orange-300 cursor-not-allowed"
                            }`}
                        >
                         Confirm
                        </button>
                      </div>
                    </label>
                  )}
                </div>

              </>
            )}


            {/* {step === 2 && (
              <>
                <h2 className="text-xl font-semibold mb-3 text-center">
                  Agreement Section 2
                </h2>
                <p className="text-gray-600 mb-4 text-sm text-justify">
                  Please review and confirm that you accept our final agreement
                  terms before proceeding to the main application.
                </p>

                <label className="flex items-center space-x-2 mb-6">
                  <input
                    type="checkbox"
                    checked={digitalPGLegalDocAccepted}
                    onChange={(e) => setDigitalPGLegalDocAccepted(e.target.checked)}
                    className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-gray-700 text-sm">
                    I have read and agree to the terms.
                  </span>
                </label>

                <div className="flex justify-center">
                  <button
                    onClick={closeSecondAgreement}
                    disabled={!digitalPGLegalDocAccepted}
                    className={`px-4 py-2 rounded text-white transition ${digitalPGLegalDocAccepted
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                      }`}
                  >
                    I Agree
                  </button>
                </div>
              </>
            )} */}
          </div>
        </div>
      )}
    </div>
  );
}
